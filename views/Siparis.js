import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Divider,
  HStack,
  VStack,
  FlatList,
  Heading,
  Box,
  Button,
  Checkbox,
  AlertDialog,
  FormControl,
  Input,
  TextArea,
  useToast,
  ScrollView
} from "native-base";
import { encode } from "base-64";
import { Clipboard } from 'expo-clipboard';

const Siparis = () => {
  const toast = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState({
    id: 0,
    ad: "",
    aciklama: "",
    kategori: "",
    fiyat: 0,
  });
  const [sepet, setSepet] = useState([]);
  const [adres, setAdres] = useState({
    ad: "",
    soyad: "",
    telefon: "",
    adres: "",
    });
  const [yemekler, setYemekler] = useState([]);
  useEffect(() => {
    YemekleriGetir();
  }, []);

  const YemekleriGetir = () => {
    fetch("https://www.lezzetsepeti.tr.ht/api.php?action=yemeklerigetir")
      .then((response) => response.json())
      .then((json) => {
        setYemekler(json);
      });
  };

  const sepetDuzenle = (e, yemek) => {
    if (e) {
      setSepet([...sepet, yemek]);
    } else {
      setSepet(sepet.filter((item) => item.id !== yemek.id));
    }
  };

  const SiparisiTamamla = () => {
    if(sepet.length == 0){
        toast.show({
            title: "Sepet Boş",
            status: "warning",
            description: "Sepetinizde ürün bulunmamaktadır.",
            placement: "top",
            duration: 3000,
        });
        return;
    }
    if(adres.ad == "" || adres.soyad == "" || adres.telefon == "" || adres.adres == ""){
        toast.show({
            title: "Eksik Bilgi",
            status: "warning",
            description: "Ad, Soyad, Telefon ve Adres bilgilerini eksiksiz giriniz.",
            placement: "top",
            duration: 3000,
        });
        return;
    }

    var toplamucret = 0;
    sepet.forEach((item) => {
        toplamucret += parseInt(item.fiyat);
    });

    
    var siparisform = new FormData();
    Object.keys(adres).forEach((key) => {
        siparisform.append(key, adres[key]);
    });
    
    siparisform.append("sepet", encode(unescape(encodeURIComponent(sepet))));
    
    siparisform.append("toplamucret", toplamucret);

    fetch("https://www.lezzetsepeti.tr.ht/api.php?action=siparisolustur", {
      method: "POST",
      headers: {
        Accept: "multipart/form-data",
      },
      body: siparisform,
    })
      .then((response) => response.json())
      .then((json) => {
        if (json.durum) {
          setIsOpen(false);
          setSepet([]);
          toast.show({
            title: "Siparişiniz Alındı",
            status: "success",
            description: "Siparişiniz başarıyla alındı.",
            placement: "top",
            duration: 3000,
            });
          toast.show({
            title: "Takip Numaranız",
            status: "success",
            description: json.takip,
            placement: "top",
            duration: 3000,
            });
            takipKopyala(json.takip);

        } else {
          toast.show({
            title: "Hata",
            status: "error",
            description: "Siparişiniz alınamadı.",
            placement: "top",
            duration: 3000,
            });
        }
      });
  };

  const takipKopyala = async(takip) => {
    navigator.clipboard.writeText(takip)
    .then(() => {toast.show({
         title: "Takip Numarası Kopyalandı",
         status: "success",
         description: "Takip numarası kopyalandı.",
         placement: "top",
         duration: 3000,
     });

    })
    // await Clipboard.setString(takip);
    // toast.show({
    //     title: "Takip Numarası Kopyalandı",
    //     status: "success",
    //     description: "Takip numarası kopyalandı.",
    //     placement: "top",
    //     duration: 3000,
    // });
  };


  return (
    <View backgroundColor="#032830" minH="100%" py={10}>
      <ScrollView colorScheme="warning">
      <Text color="#ffca00" bold textAlign="center" my={2} fontSize="4xl">
        Lezzet Sepeti
      </Text>
      <Divider my={2} />

      <Box mx={5} colorScheme="warning" background="warning.900" borderRadius={5} p={2}>
        <Heading fontSize="xl" py="4" color="warning.300">
          Yemekler
        </Heading>
        <FlatList
          data={yemekler.filter((item) => item.kategori == 1)}
          renderItem={({ item }) => (
            <Box
              borderBottomWidth="1"
              borderColor="coolGray.200"
              pl={["0", "4"]}
              pr={["0", "5"]}
              py="2"
            >
              <HStack justifyContent="space-between">
                <Text color="lightText" pt={2} bold>
                  {item.ad}
                </Text>
                <Button
                  size="md"
                  variant="outline"
                  alignSelf="flex-end"
                  onPress={() => setSelected(item) & setIsOpen(true)}
                >
                  <Text color="warning.400">Detay</Text>
                </Button>

                <Text
                  fontSize="lg"
                  mr={5}
                  color="lightText"
                  alignSelf="flex-end"
                >
                  {item.fiyat}₺
                </Text>

                <Checkbox
                  size="md"
                  colorScheme="warning"
                  pt={2}
                  onChange={(e) => sepetDuzenle(e, item)}
                />
              </HStack>
            </Box>
          )}
          keyExtractor={(item) => item.id}
        />
      </Box>
      <Divider my={2} />
      <Box mx={5} colorScheme="warning" background="warning.900" borderRadius={5} p={2}>
        <Heading fontSize="xl" py="4" color="warning.300">
          İçecekler
        </Heading>
        <FlatList
          data={yemekler.filter((item) => item.kategori == 2)}
          renderItem={({ item }) => (
            <Box
              borderBottomWidth="1"
              borderColor="coolGray.200"
              pl={["0", "4"]}
              pr={["0", "5"]}
              py="2"
            >
              <HStack justifyContent="space-between">
                <Text color="lightText" pt={2} bold>
                  {item.ad}
                </Text>
                <Button
                  size="md"
                  variant="outline"
                  alignSelf="flex-end"
                  onPress={() => setSelected(item) & setIsOpen(true)}
                >
                  <Text color="warning.400">Detay</Text>
                </Button>

                <Text
                  fontSize="lg"
                  mr={5}
                  color="lightText"
                  alignSelf="flex-end"
                >
                  {item.fiyat}₺
                </Text>

                <Checkbox
                  size="md"
                  colorScheme="warning"
                  pt={2}
                  onChange={(e) => sepetDuzenle(e, item)}
                />
              </HStack>
            </Box>
          )}
          keyExtractor={(item) => item.id}
        />
      </Box>
      <Divider my={2} />
      <Box mx={5} colorScheme="warning" background="warning.900" borderRadius={5} p={2}>
        <Heading fontSize="xl" py="4" color="warning.300">
          Tatlılar
        </Heading>
        <FlatList
          data={yemekler.filter((item) => item.kategori == 5)}
          renderItem={({ item }) => (
            <Box
              borderBottomWidth="1"
              borderColor="coolGray.200"
              pl={["0", "4"]}
              pr={["0", "5"]}
              py="2"
            >
              <HStack justifyContent="space-between">
                <Text color="lightText" pt={2} bold>
                  {item.ad}
                </Text>
                <Button
                  size="md"
                  variant="outline"
                  alignSelf="flex-end"
                  onPress={() => setSelected(item) & setIsOpen(true)}
                >
                  <Text color="warning.400">Detay</Text>
                </Button>

                <Text
                  fontSize="lg"
                  mr={5}
                  color="lightText"
                  alignSelf="flex-end"
                >
                  {item.fiyat}₺
                </Text>

                <Checkbox
                  size="md"
                  colorScheme="warning"
                  pt={2}
                  onChange={(e) => sepetDuzenle(e, item)}
                />
              </HStack>
            </Box>
          )}
          keyExtractor={(item) => item.id}
        />
      </Box>
      <Divider my={2} />
      <Box mx={5} colorScheme="warning" background="warning.900" borderRadius={5} p={2}>
        <Heading fontSize="xl" py="4" color="warning.300">
          Atıştırmalıklar
        </Heading>
        <FlatList
          data={yemekler.filter((item) => item.kategori == 4)}
          renderItem={({ item }) => (
            <Box
              borderBottomWidth="1"
              borderColor="coolGray.200"
              pl={["0", "4"]}
              pr={["0", "5"]}
              py="2"
            >
              <HStack justifyContent="space-between">
                <Text color="lightText" pt={2} bold>
                  {item.ad}
                </Text>
                <Button
                  size="md"
                  variant="outline"
                  alignSelf="flex-end"
                  onPress={() => setSelected(item) & setIsOpen(true)}
                >
                  <Text color="warning.400">Detay</Text>
                </Button>

                <Text
                  fontSize="lg"
                  mr={5}
                  color="lightText"
                  alignSelf="flex-end"
                >
                  {item.fiyat}₺
                </Text>

                <Checkbox
                  size="md"
                  colorScheme="warning"
                  pt={2}
                  onChange={(e) => sepetDuzenle(e, item)}
                />
              </HStack>
            </Box>
          )}
          keyExtractor={(item) => item.id}
        />
      </Box>
      <Divider my={2} />
      <Box mx={5} colorScheme="warning" background="warning.900" borderRadius={5} p={2}>
        <Heading fontSize="xl" py="4" color="warning.300">
          Soslar
        </Heading>
        <FlatList
          data={yemekler.filter((item) => item.kategori == 3)}
          renderItem={({ item }) => (
            <Box
              borderBottomWidth="1"
              borderColor="coolGray.200"
              pl={["0", "4"]}
              pr={["0", "5"]}
              py="2"
            >
              <HStack justifyContent="space-between">
                <Text color="lightText" pt={2} bold>
                  {item.ad}
                </Text>
                <Button
                  size="md"
                  variant="outline"
                  alignSelf="flex-end"
                  onPress={() => setSelected(item) & setIsOpen(true)}
                >
                  <Text color="warning.400">Detay</Text>
                </Button>

                <Text
                  fontSize="lg"
                  mr={5}
                  color="lightText"
                  alignSelf="flex-end"
                >
                  {item.fiyat}₺
                </Text>

                <Checkbox
                  size="md"
                  colorScheme="warning"
                  pt={2}
                  onChange={(e) => sepetDuzenle(e, item)}
                />
              </HStack>
            </Box>
          )}
          keyExtractor={(item) => item.id}
        />
      </Box>

      <AlertDialog isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <AlertDialog.Content>
          <AlertDialog.CloseButton />
          <AlertDialog.Header>{selected.ad}</AlertDialog.Header>
          <AlertDialog.Body>{selected.aciklama}</AlertDialog.Body>
          <AlertDialog.Footer>
            <Button.Group space={2}>
              <Button colorScheme="warning" onPress={() => setIsOpen(false)}>
                Kapat
              </Button>
            </Button.Group>
          </AlertDialog.Footer>
        </AlertDialog.Content>
      </AlertDialog>

      <Divider my={3} />

      <Heading fontSize="xl" p="4" color="warning.300">
        Adres Bilgileri
        <Divider my={1} />
      </Heading>

      <VStack mx={5} colorScheme="warning" background="warning.900" safeArea borderRadius={5} p={2}>
        <Box alignItems="center">
          <FormControl w="80%" maxW="300px">
            <FormControl.Label>
              <Text fontSize="2xl" bold color="lightText">
                Ad
              </Text>
            </FormControl.Label>
            <Input
              placeholder="Ad Giriniz"
              fontSize="2xl"
              bold
              color="lightText"
              value={adres.ad}
                onChangeText={(text) => setAdres({ ...adres, ad: text })}
            />
          </FormControl>
          <FormControl w="80%" maxW="300px">
            <FormControl.Label>
              <Text fontSize="2xl" bold color="lightText">
                Soyad
              </Text>
            </FormControl.Label>
            <Input
              placeholder="Soyad Giriniz"
              fontSize="2xl"
              bold
              color="lightText"
              value={adres.soyad}
                onChangeText={(text) => setAdres({ ...adres, soyad: text })}
            />
          </FormControl>
          <FormControl w="80%" maxW="300px">
            <FormControl.Label>
              <Text fontSize="2xl" bold color="lightText">
                Telefon
              </Text>
            </FormControl.Label>
            <Input
              placeholder="Telefon Giriniz"
              fontSize="2xl"
              keyboardType="numeric"
              bold
              color="lightText"
                value={adres.telefon}
                onChangeText={(text) => setAdres({ ...adres, telefon: text })}
            />
          </FormControl>
          <FormControl w="80%" maxW="300px">
            <FormControl.Label>
              <Text fontSize="2xl" bold color="lightText">
                Adres Giriniz
              </Text>
            </FormControl.Label>
            <TextArea
              placeholder="Adres Giriniz"
              fontSize="2xl"
              bold
              color="lightText"
                value={adres.adres}
                onChangeText={(text) => setAdres({ ...adres, adres: text })}
            />
          </FormControl>
          <Divider my={2} />
          <Button
            size="lg"
            colorScheme="warning"
            onPress={() => SiparisiTamamla()}
          >
            <Text fontSize="xl" bold>
              Siparişi Tamamla
            </Text>
          </Button>
        </Box>
      </VStack>
      </ScrollView>
    </View>
  );
};

export default Siparis;
