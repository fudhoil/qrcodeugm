import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Button,
  Modal,
  Pressable,
  ImageBackground,
  TouchableHighlight,
  Alert,
} from "react-native";
import { s } from "react-native-wind";
import { useDispatch, useSelector } from "react-redux";
import React, { useState, useEffect } from "react";
import { BarCodeScanner } from "expo-barcode-scanner";
import { checkData } from "../slices/checkSlice";

const HomeScreen = () => {
  const dispatch = useDispatch();
  const { hasil, status } = useSelector((state) => state.check);
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const decipher = (salt) => {
    const textToChars = (text) => text.split("").map((c) => c.charCodeAt(0));
    const applySaltToChar = (code) =>
      textToChars(salt).reduce((a, b) => a ^ b, code);
    return (encoded) =>
      encoded
        .match(/.{1,2}/g)
        .map((hex) => parseInt(hex, 16))
        .map(applySaltToChar)
        .map((charCode) => String.fromCharCode(charCode))
        .join("");
  };

  const myDecipher = decipher("aksd2344erd@");
  useEffect(() => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, [hasil]);

  const handleBarCodeScanned = ({ _, data }) => {
    const decoded = myDecipher(data);
    if (decoded.includes("@")) {
      setScanned(true);
      dispatch(checkData(decoded));
      setModalVisible(true);
    }
  };
  if (hasPermission === null) {
    return <Text>Requesting for camera permission</Text>;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }
  return (
    <SafeAreaView style={s`bg-blue-500 h-full`}>
      <View style={s`p-5 bg-white`}></View>

      <View style={s`flex-1`}>
        <ImageBackground
          source={require("../images/bg11.png")}
          resizeMode="cover"
          style={styles.image}
        >
          <View style={s`flex-1 py-5 px-3`}>
            <Text style={styles.title}>QRCode Scanner</Text>
            <Text style={styles.titleSmall}>for UGM | UIF</Text>
            <BarCodeScanner
              onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
              style={(StyleSheet.absoluteFillObject, s`mt-5`)}
              height={650}
            />
          </View>

          <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => {
              Alert.alert("Modal has been closed.");
              setModalVisible(!modalVisible);
            }}
          >
            <View style={styles.centeredView}>
              <View style={styles.modalView}>
                <Text style={styles.modalText}>
                  {hasil?.data?.length > 0 ? (
                    <>
                      <Text>Scan Successfull, Welcome</Text>{" "}
                      {status === "success" && (
                        <TouchableHighlight
                          style={s`bg-blue-300 w-full rounded-md p-2`}
                        >
                          <View>
                            <Text style={styles.modalTextSuccess}>
                              {hasil.data[0].fullName2 && "1."}{" "}
                              {hasil.data[0].fullName}
                            </Text>
                            {hasil.data[0].fullName2 && (
                              <Text style={styles.modalTextSuccess}>
                                2. {hasil.data[0].fullName2}
                              </Text>
                            )}
                            {hasil.data[0].fullName3 && (
                              <Text style={styles.modalTextSuccess}>
                                3. {hasil.data[0].fullName3}
                              </Text>
                            )}
                          </View>
                        </TouchableHighlight>
                      )}
                    </>
                  ) : (
                    <>
                      <TouchableHighlight
                        style={s`bg-red-500 rounded-full p-2`}
                      >
                        <Text style={styles.modalTextSuccess}>
                          Data Not Found
                        </Text>
                      </TouchableHighlight>
                    </>
                  )}
                </Text>
                <Pressable
                  style={[styles.button, styles.buttonClose]}
                  onPress={() => setModalVisible(!modalVisible)}
                >
                  <Text style={styles.textStyle}>close</Text>
                </Pressable>
              </View>
            </View>
          </Modal>
          {scanned && (
            <Button
              title={"Tap to Scan Again"}
              onPress={() => setScanned(false)}
            />
          )}
        </ImageBackground>
      </View>
    </SafeAreaView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  title: {
    fontSize: 30,
    color: "white",
  },
  titleSmall: {
    fontSize: 20,
    color: "white",
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    paddingBottom: 10,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 10,
    padding: 5,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: "#F194FF",
  },
  buttonClose: {
    marginTop: 50,
    backgroundColor: "white",
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#2196F3",
  },
  textStyle: {
    color: "#000",
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 20,
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
    fontSize: 30,
  },
  modalTextSuccess: {
    fontSize: 30,
  },
  barcode: {},
  image: {
    flex: 1,
  },
});
