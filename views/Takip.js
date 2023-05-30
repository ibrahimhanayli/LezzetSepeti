import React, {  useState } from "react";
import { View, Text, Divider, VStack, Button, Input, Card } from "native-base";

const Takip = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [takip, setTakip] = useState();
  const [durum, setDurum] = useState();
  const BilgiGetir = () => {
    fetch("https://www.lezzetsepeti.tr.ht/api.php?action=takip&takip=" + takip)
      .then((response) => response.json())
      .then((json) => {
        setDurum(parseInt(json[0].durum));
        setIsOpen(true);
      });
  };

  return (
    <View
      backgroundColor="#032830"
      minH="100%"
      justifyContent="center"
      alignContent="center"
      alignItems="center"
    >
      <Text
        color="#ffca00"
        bold
        textAlign="center"
        my={2}
        mt={10}
        fontSize="4xl"
      >
        Lezzet Sepeti | Takip
      </Text>
      <Divider my={2} />

      <VStack space={2} alignItems="center" justifyContent="center" mt={10}>
        <Input
          placeholder="Takip Kodu"
          placeholderTextColor="#ffca00"
          color="#ffca00"
          onChangeText={(takip) => setTakip(takip)}
          value={takip}
          backgroundColor="#032830"
          borderColor="#ffca00"
          borderWidth="2"
          borderRadius="10"
          w="80%"
          mx={2}
          fontSize="3xl"
        />

        <Button colorScheme="warning" onPress={() => BilgiGetir()}>
          <Text color="#032830" bold fontSize="2xl">
            Takip Et
          </Text>
        </Button>

        <Divider my={2} />

        {isOpen == true && (
          <Card
            w="80%"
            mx={2}
            p={2}
            backgroundColor="#032830"
            borderColor="#ffca00"
            borderWidth="2"
            borderRadius="10"
          >
            <Text color="#ffca00" bold fontSize="2xl">
              Sipariş Durumu
            </Text>
            <Divider my={2} />
            <Text color="#ffca00" bold fontSize="2xl">
              {durum !== undefined &&
                (() => {
                  switch (durum) {
                    case 0:
                      return "Siparişiniz Alındı";
                    case 1:
                      return "Siparişiniz Hazırlanıyor";
                    case 2:
                      return "Siparişiniz Yolda";
                    case 3:
                      return "Siparişiniz Teslim Edildi";
                    case 4:
                      return "Sipariş İptal Edildi";
                    default:
                      return null;
                  }
                })()}
            </Text>
          </Card>
        )}
      </VStack>
    </View>
  );
};

export default Takip;
