import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Divider,
  HStack,
  Button,
} from "native-base";
import { useNavigation } from "@react-navigation/native";

const Anasayfa = () => {
    const navigation = useNavigation();

  return (
    <View backgroundColor="#032830" minH="100%" justifyContent="center" alignContent="center" alignItems="center">
      <Text color="#ffca00" textAlign="center" my={2} mt={10} fontSize="6xl" bold >
        Lezzet Sepeti
      </Text>
      <Divider my={2} />

        <HStack space={2} alignItems="center" justifyContent="center" mt={10}>
            <Button
                size="lg"
                colorScheme="warning"
                onPress={() => navigation.navigate("siparis")}
            >
                <Text fontSize="xl" bold>Sipariş Ver</Text>
            </Button>
            <Button
                size="lg"
                colorScheme="warning"
                onPress={() => navigation.navigate("takip")}
            >
                <Text fontSize="xl" bold>Sipariş Takip</Text>
            </Button>
            </HStack>
      
    </View>
  );
};

export default Anasayfa;
