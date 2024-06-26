"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { FormError } from "@/components/form-error";
import { FormSuccess } from "@/components/form-success";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { alicia, bahaytoro, balingasa, bungad, damar, damayan, delmonte, katipunan, mariblo, masambong, nayongkanluran, paangbundok, pagibigsanayon, paltok, paraiso, philam, project6, ramonmagsaysay, saintpeter, salvacion, sanantonio, sanjose, santacruz, santateresita, santocristo, santodomingo, sienna, talayan, vasra, veteransvillage, westtriangle } from "@/lib/d1";
import { bagongsilangan, batasanhills, commonwealth, holyspirit, payatas } from "@/lib/d2";
import { amihan, bagumbayan, bagumbuhay, bayanihan, blueridgea, blueridgeb, campaguinaldo, claro, dioquinozobel, duyanduyan, eastkamias, erodriguez, escopa1, escopa2, escopa3, escopa4, loyolaHeights, mangga, marilag, masagana, matandangbalara, milagrosa, pansol, quirino2A, quirino2B, quirino2C, quirino3A, saintIgnatius, sanRoque, silangan, socorro, tagumpay, ugongNorte, villaMariaClara, westKamias, whitePlains } from "@/lib/d3";
import usePasswordToggle from "@/lib/hooks/usePasswordToggle";
import { RegisterSchema } from "@/lib/validations/auth";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { register } from "../../actions/register";
import { BackButton } from "./back-button";
import { Header } from "./header";
import { Card, CardFooter, CardHeader } from "./ui/card";
import { Checkbox } from "./ui/checkbox";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "./ui/select";
import { toast } from "./ui/use-toast";
import { bagongLipunanNgCrame, botocan, central, damayangLagi, donManuel, donaImelda, donaJosefa, horseshoe, immaculateConception, kalusugan, kamuning, kaunlaran, kristongHari, krusNaLigas, lagingHanda, malaya, mariana, obrero, oldCapitolSite, paligsahan, pinagkaisahan, pinyahan, roxas, sacredHeart, sanIsidro, sanMartinDePorres, sanVicente, santol, sikatunaVillage, southTriangle, stoNino, tatalon, teachersVillageEast, teachersVillageWest, upCampus, upVillage, valencia } from "@/lib/d4";
import { bagbag, capri, fairview, greaterLagro, gulod, kaligayahan, nagkaisangNayon, northFairview, novalichesProper, pasongPutikProper, sanAgustin, sanBartolome, santaLucia, santaMonica } from "@/lib/d5";
import { apolonioSamson, baesa, balongBato, culiat, sangandaan, sauyo, talipapaStreets, tandangSoraStreets } from "@/lib/d6";

type StateType = {
  countryCode: string;
  isoCode: string;
  latitude: string;
  longitude: string;
  name: string;
}

type CityType = {
  stateCode: string;
  latitude: string;
  longitude: string;
  name: string;
  countryCode: string;
}

interface BarangayStreets {
  [key: string]: string[]; // Define index signature
}

export const RegisterForm = () => {
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const [PasswordInputType, ToggleIcon] = usePasswordToggle();
  const [ConfirmPasswordInputType, ConfirmToggleIcon] = usePasswordToggle();
  // let countryData = Country.getAllCountries();
  // let currentStateData = State.getStateByCode("NCR")
  // const [stateData, setStateData] = useState();
  // const [cityData, setCityData] = useState();
  // const [country, setCountry] = useState(countryData[173]);
  // const [state, setState] = useState<StateType>();
  // console.log(state)
  // const [city, setCity] = useState<CityType>();
  const [district, setDistrict] = useState("")
  const [barangay, setBarangay] = useState("")
  const [street, setStreet] = useState("")
  const [isPending, startTransition] = useTransition()
  const [formStep, setFormStep] = useState(1)
  // const [customStreet, setCustomStreet] = useState('');
  const [showInput, setShowInput] = useState(false);

  const router = useRouter();

  // useEffect(() => {
  //   //@ts-ignore
  //   setStateData(State.getStatesOfCountry(country?.isoCode));
  // }, [country]);

  // useEffect(() => {
  //   //@ts-ignore
  //   setCityData(City.getCitiesOfState(country?.isoCode, state?.isoCode));
  // }, [state]);

  // useEffect(() => {
  //   stateData && setState(stateData[59]);
  // }, [stateData]);

  // useEffect(() => {
  //   cityData && setCity(cityData[23]);
  // }, [cityData]);

  const form = useForm<z.infer<typeof RegisterSchema>>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      email: "",
      password: "",
      name: "",
    },
  });

  const onSubmit = (values: z.infer<typeof RegisterSchema>) => {
    setError("");
    setSuccess("");

    startTransition(() => {
      register(values, barangay, district, "Quezon City", street)
        .then((data) => {
          setError(data.error);
          setSuccess(data.success);
        });
    });
  };

  const handleBarangayChange = (selectedBarangay: string) => {
    setBarangay(selectedBarangay);
    setStreet("");
  };

  const barangayStreets: BarangayStreets = {
    Alicia: alicia,
    'Bahay Toro': bahaytoro,
    Balingasa: balingasa,
    Bungad: bungad,
    Damar: damar,
    Damayan: damayan,
    'Del Monte': delmonte, // Add Del Monte
    Katipunan: katipunan, // Add Katipunan
    Mariblo: mariblo, // Add Mariblo
    Masambong: masambong, // Add Masambong
    'Nayong Kanluran': nayongkanluran, // Add Nayong Kanluran
    'Paang Bundok': paangbundok, // Add Paang Bundok
    'Pag-ibig sa Nayon': pagibigsanayon, // Add Pag-ibig sa Nayon
    Paltok: paltok, // Add Paltok
    Paraiso: paraiso, // Add Paraiso
    'Phil-Am': philam, // Add Phil-Am
    'Project 6': project6, // Add Project 6
    'Ramon Magsaysay': ramonmagsaysay, // Add Ramon Magsaysay
    'Saint Peter': saintpeter, // Add Saint Peter
    Salvacion: salvacion, // Add Salvacion
    'San Antonio': sanantonio, // Add San Antonio
    'San Jose': sanjose, // Add San Jose
    'Santa Cruz': santacruz, // Add Santa Cruz
    'Santa Teresita': santateresita, // Add Santa Teresita
    'Sto. Cristo': santocristo, // Add Sto. Cristo
    'Santo Domingo': santodomingo, // Add Santo Domingo
    Siena: sienna, // Add Siena
    Talayan: talayan, // Add Talayan
    Vasra: vasra, // Add Vasra
    'Veterans Village': veteransvillage, // Add Veterans Village
    'West Triangle': westtriangle, // Add West Triangle
    'Bagong Silangan': bagongsilangan, // Add Bagong Silangan
    'Batasan Hills': batasanhills, // Add Batasan Hills
    Commonwealth: commonwealth, // Add Commonwealth
    'Holy Spirit': holyspirit, // Add Holy Spirit
    'Payatas (Litex)': payatas, // Add Payatas (Litex)
    Amihan: amihan, // Add Amihan
    Bagumbayan: bagumbayan, // Add Bagumbayan
    Bagumbuhay: bagumbuhay, // Add Bagumbuhay
    Bayanihan: bayanihan, // Add Bayanihan
    'Blue Ridge A': blueridgea, // Add Blue Ridge A
    'Blue Ridge B': blueridgeb, // Add Blue Ridge B
    'Camp Aguinaldo': campaguinaldo, // Add Camp Aguinaldo
    'Claro (Quirino 3-B)': claro, // Add Claro (Quirino 3-B)
    'Dioquino Zobel': dioquinozobel, // Add Dioquino Zobel
    'Duyan-duyan': duyanduyan, // Add Duyan-duyan
    'E. Rodriguez': erodriguez, // Add E. Rodriguez
    'East Kamias': eastkamias, // Add East Kamias
    'Escopa I': escopa1, // Add Escopa I
    'Escopa II': escopa2, // Add Escopa II
    'Escopa III': escopa3, // Add Escopa III
    'Escopa IV': escopa4, // Add Escopa IV
    'Loyola Heights': loyolaHeights, // Add Loyola Heights
    Mangga: mangga, // Add Mangga
    Marilag: marilag, // Add Marilag
    Masagana: masagana, // Add Masagana
    'Matandang Balara': matandangbalara, // Add Matandang Balara
    Milagrosa: milagrosa, // Add Milagrosa
    Pansol: pansol, // Add Pansol
    'Quirino 2-A': quirino2A, // Add Quirino 2-A
    'Quirino 2-B': quirino2B, // Add Quirino 2-B
    'Quirino 2-C': quirino2C, // Add Quirino 2-C
    'Quirino 3-A': quirino3A, // Add Quirino 3-A
    'St. Ignatius': saintIgnatius, // Add St. Ignatius
    'San Roque': sanRoque, // Add San Roque
    Silangan: silangan, // Add Silangan
    Socorro: socorro, // Add Socorro
    Tagumpay: tagumpay, // Add Tagumpay
    'Ugong Norte': ugongNorte,
    'Villa Maria Clara': villaMariaClara,
    'West Kamias': westKamias,
    'White Plains': whitePlains,
    'Bagong Lipunan ng Crame': bagongLipunanNgCrame,
    Botocan: botocan,
    Central: central,
    'Damayang Lagi': damayangLagi,
    'Don Manuel': donManuel,
    'Doña Imelda': donaImelda,
    'Doña Josefa': donaJosefa,
    Horseshoe: horseshoe,
    'Immaculate Conception': immaculateConception,
    Kalusugan: kalusugan,
    Kamuning: kamuning,
    Kaunlaran: kaunlaran,
    'Kristong Hari': kristongHari,
    'Krus na Ligas': krusNaLigas,
    'Laging Handa': lagingHanda,
    Malaya: malaya,
    Mariana: mariana,
    Obrero: obrero,
    'Old Capitol Site': oldCapitolSite,
    Paligsahan: paligsahan,
    Pinagkaisahan: pinagkaisahan,
    Pinyahan: pinyahan,
    Roxas: roxas,
    'Sacred Heart': sacredHeart,
    'San Isidro': sanIsidro,
    'San Martin de Porres': sanMartinDePorres,
    'San Vicente': sanVicente,
    Santol: santol,
    'Sikatuna Village': sikatunaVillage,
    'South Triangle': southTriangle,
    'Sto. Niño': stoNino,
    Tatalon: tatalon,
    'Teacher\'s Village East': teachersVillageEast,
    'Teacher\'s Village West': teachersVillageWest,
    'U.P. Campus': upCampus,
    'U.P. Village': upVillage,
    Valencia: valencia,
    Bagbag: bagbag,
    Capri: capri,
    Fairview: fairview,
    Gulod: gulod,
    'Greater Lagro': greaterLagro,
    Kaligayahan: kaligayahan,
    'Nagkaisang Nayon': nagkaisangNayon,
    'North Fairview': northFairview,
    'Novaliches Proper': novalichesProper,
    'Pasong Putik Proper': pasongPutikProper,
    'San Agustin': sanAgustin,
    'San Bartolome': sanBartolome,
    'Sta. Lucia': santaLucia,
    'Sta. Monica': santaMonica,
    'Apolonio Samson': apolonioSamson,
    Baesa: baesa,
    'Balong Bato': balongBato,
    Culiat: culiat,
    Sangandaan: sangandaan,
    Sauyo: sauyo,
    Talipapa: talipapaStreets,
    'Tandang Sora': tandangSoraStreets,
  };

  const renderStreetOptions = () => {
    if (barangay && barangayStreets[barangay]) {
      return barangayStreets[barangay].map((streetName: string) => (
        <SelectItem key={streetName} value={streetName}>{streetName}</SelectItem>
      ));
    } else {
      return null;
    }
  };

  // const renderStreetOptions = () => {
  //   if (!showInput) {
  //     if (barangay && barangayStreets[barangay]) {
  //       return barangayStreets[barangay].map((streetName: string) => (
  //         <SelectItem key={streetName} value={streetName}>{streetName}</SelectItem>
  //       ));
  //     } else {
  //       return null;
  //     }
  //   } else {
  //     return (
  //       <>
  //         <Input
  //           type="text"
  //           value={customStreet}
  //           onChange={(e) => setCustomStreet(e.target.value)}
  //           placeholder="Enter your street"
  //         />
  //         <button onClick={() => setShowInput(false)}>Cancel</button>
  //         <button onClick={() => setStreet(customStreet)}>Save</button>
  //       </>
  //     );
  //   }
  // };

  return (
    <div className="h-screen w-full flex items-center justify-center bg-[#84D187]">
      <Card className="w-[400px] shadow-md p-6 max-md:overflow-y-scroll max-h-screen">

        {formStep === 1 && (
          <CardHeader>
            <Header label="Create an account" />
          </CardHeader>
        )}

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6"
          >
            {formStep === 1 && (
              <div className="space-y-2">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          disabled={isPending}
                          placeholder="john.doe@example.com"
                          type="email"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>First name</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          disabled={isPending}
                          placeholder="John"
                          onKeyPress={(event) => {
                            const charCode = event.which
                              ? event.which
                              : event.keyCode;
                            if (
                              !(charCode >= 65 && charCode <= 90) &&
                              !(charCode >= 97 && charCode <= 122) &&
                              charCode !== 8 &&
                              charCode !== 9 &&
                              charCode !== 0
                            ) {
                              event.preventDefault();
                            }
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Last Name</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          disabled={isPending}
                          placeholder="Doe"
                          onKeyPress={(event) => {
                            const charCode = event.which
                              ? event.which
                              : event.keyCode;
                            if (
                              !(charCode >= 65 && charCode <= 90) &&
                              !(charCode >= 97 && charCode <= 122) &&
                              charCode !== 8 &&
                              charCode !== 9 &&
                              charCode !== 0
                            ) {
                              event.preventDefault();
                            }
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl className="w-full">
                        <Input
                          {...field}
                          disabled={isPending}
                          placeholder="******"
                          type={PasswordInputType as string}
                          ToggleIcon={ToggleIcon}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirm Password</FormLabel>
                      <FormControl className="w-full">
                        <Input
                          {...field}
                          disabled={isPending}
                          placeholder="******"
                          type={ConfirmPasswordInputType as string}
                          ToggleIcon={ConfirmToggleIcon}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  className="w-full mt-5"
                  variant="primary"
                  onClick={() => {
                    form.trigger(['confirmPassword', 'password', 'lastName', 'name', 'email'])

                    const cpState = form.getFieldState("confirmPassword")
                    const pwState = form.getFieldState("password")
                    const lnState = form.getFieldState("lastName")
                    const fnState = form.getFieldState("name")
                    const emState = form.getFieldState("email")

                    const cp = form.getValues("confirmPassword")
                    const pw = form.getValues("password")

                    if (pw !== cp) return toast({
                      description: "password does not match",
                      variant: "destructive"
                    })

                    if (!cpState.isDirty || cpState.invalid) return;
                    if (!pwState.isDirty || pwState.invalid) return;
                    if (!lnState.isDirty || lnState.invalid) return;
                    if (!fnState.isDirty || fnState.invalid) return;
                    if (!emState.isDirty || emState.invalid) return;

                    setFormStep(2)
                  }}
                >
                  Next Step
                </Button>
              </div>
            )}

            {formStep === 2 && (
              <>
                <div className="mt-6">
                  <FormField
                    control={form.control}
                    name="companyName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Company Name (Optional)</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter Company Name..." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Address</FormLabel>
                      <FormControl>
                        <Input placeholder="House #/Block #/ Lot #" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />


                <div className="grid grid-cols-1 md:grid-cols-2 mt-5 gap-3">
                  <Select value={district} onValueChange={setDistrict}>
                    <SelectTrigger className="">
                      <SelectValue placeholder="Select a district" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Districts</SelectLabel>
                        <>
                          <SelectItem value="District 1">District 1</SelectItem>
                          <SelectItem value="District 2">District 2</SelectItem>
                          <SelectItem value="District 3">District 3</SelectItem>
                          <SelectItem value="District 4">District 4</SelectItem>
                          <SelectItem value="District 5">District 5</SelectItem>
                          <SelectItem value="District 6">District 6</SelectItem>
                        </>
                      </SelectGroup>
                    </SelectContent>
                  </Select>

                  <Select value={barangay} onValueChange={handleBarangayChange}>
                    <SelectTrigger className="">
                      <SelectValue placeholder="Select a barangay" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Barangay</SelectLabel>
                        <>
                          {district === "District 1" && (
                            <>
                              <SelectItem value="Alicia">Alicia</SelectItem>
                              <SelectItem value="Bago Bantay">Bago Bantay</SelectItem>
                              <SelectItem value="Bagong Pag-asa">Bagong Pag-asa</SelectItem>
                              <SelectItem value="Bahay Toro">Bahay Toro</SelectItem>
                              <SelectItem value="Balingasa">Balingasa</SelectItem>
                              <SelectItem value="Bungad">Bungad</SelectItem>
                              <SelectItem value="Damar">Damar</SelectItem>
                              <SelectItem value="Damayan">Damayan</SelectItem>
                              <SelectItem value="Del Monte">Del Monte</SelectItem>
                              <SelectItem value="Katipunan">Katipunan</SelectItem>
                              <SelectItem value="Lourdes">Lourdes</SelectItem>
                              <SelectItem value="Maharlika">Maharlika</SelectItem>
                              <SelectItem value="Manresa">Manresa</SelectItem>
                              <SelectItem value="Mariblo">Mariblo</SelectItem>
                              <SelectItem value="Masambong">Masambong</SelectItem>
                              <SelectItem value="N.S. Amoranto (Gintong Silahis)">N.S. Amoranto (Gintong Silahis)</SelectItem>
                              <SelectItem value="Nayong Kanluran">Nayong Kanluran</SelectItem>
                              <SelectItem value="Paang Bundok">Paang Bundok</SelectItem>
                              <SelectItem value="Pag-ibig sa Nayon">Pag-ibig sa Nayon</SelectItem>
                              <SelectItem value="Paltok">Paltok</SelectItem>
                              <SelectItem value="Paraiso">Paraiso</SelectItem>
                              <SelectItem value="Phil-Am">Phil-Am</SelectItem>
                              <SelectItem value="Project 6">Project 6</SelectItem>
                              <SelectItem value="Ramon Magsaysay">Ramon Magsaysay</SelectItem>
                              <SelectItem value="Saint Peter">Saint Peter</SelectItem>
                              <SelectItem value="Salvacion">Salvacion</SelectItem>
                              <SelectItem value="San Antonio">San Antonio</SelectItem>
                              <SelectItem value="San Isidro Labrador">San Isidro Labrador</SelectItem>
                              <SelectItem value="San Jose">San Jose</SelectItem>
                              <SelectItem value="Santa Cruz">Santa Cruz</SelectItem>
                              <SelectItem value="Santa Teresita">Santa Teresita</SelectItem>
                              <SelectItem value="Sto. Cristo">Sto. Cristo</SelectItem>
                              <SelectItem value="Santo Domingo">Santo Domingo</SelectItem>
                              <SelectItem value="Siena">Siena</SelectItem>
                              <SelectItem value="Talayan">Talayan</SelectItem>
                              <SelectItem value="Vasra">Vasra</SelectItem>
                              <SelectItem value="Veterans Village">Veterans Village</SelectItem>
                              <SelectItem value="West Triangle">West Triangle</SelectItem>
                            </>
                          )}
                          {district === "District 2" && (
                            <>
                              <SelectItem value="Bagong Silangan">Bagong Silangan</SelectItem>
                              <SelectItem value="Batasan Hills">Batasan Hills</SelectItem>
                              <SelectItem value="Commonwealth">Commonwealth</SelectItem>
                              <SelectItem value="Holy Spirit">Holy Spirit</SelectItem>
                              <SelectItem value="Payatas (Litex)">Payatas (Litex)</SelectItem>
                            </>
                          )}
                          {district === "District 3" && (
                            <>
                              <SelectItem value="Amihan">Amihan</SelectItem>
                              <SelectItem value="Bagumbayan">Bagumbayan</SelectItem>
                              <SelectItem value="Bagumbuhay">Bagumbuhay</SelectItem>
                              <SelectItem value="Bayanihan">Bayanihan</SelectItem>
                              <SelectItem value="Blue Ridge A">Blue Ridge A</SelectItem>
                              <SelectItem value="Blue Ridge B">Blue Ridge B</SelectItem>
                              <SelectItem value="Camp Aguinaldo">Camp Aguinaldo</SelectItem>
                              <SelectItem value="Claro (Quirino 3-B)">Claro (Quirino 3-B)</SelectItem>
                              <SelectItem value="Dioquino Zobel">Dioquino Zobel</SelectItem>
                              <SelectItem value="Duyan-duyan">Duyan-duyan</SelectItem>
                              <SelectItem value="E. Rodriguez">E. Rodriguez</SelectItem>
                              <SelectItem value="East Kamias">East Kamias</SelectItem>
                              <SelectItem value="Escopa I">Escopa I</SelectItem>
                              <SelectItem value="Escopa II">Escopa II</SelectItem>
                              <SelectItem value="Escopa III">Escopa III</SelectItem>
                              <SelectItem value="Escopa IV">Escopa IV</SelectItem>
                              <SelectItem value="Libis">Libis</SelectItem>
                              <SelectItem value="Loyola Heights">Loyola Heights</SelectItem>
                              <SelectItem value="Mangga">Mangga</SelectItem>
                              <SelectItem value="Marilag">Marilag</SelectItem>
                              <SelectItem value="Masagana">Masagana</SelectItem>
                              <SelectItem value="Matandang Balara">Matandang Balara</SelectItem>
                              <SelectItem value="Old Balara">Old Balara</SelectItem>
                              <SelectItem value="Milagrosa">Milagrosa</SelectItem>
                              <SelectItem value="Pansol">Pansol</SelectItem>
                              <SelectItem value="Quirino 2-A">Quirino 2-A</SelectItem>
                              <SelectItem value="Quirino 2-B">Quirino 2-B</SelectItem>
                              <SelectItem value="Quirino 2-C">Quirino 2-C</SelectItem>
                              <SelectItem value="Quirino 3-A">Quirino 3-A</SelectItem>
                              <SelectItem value="St. Ignatius">St. Ignatius</SelectItem>
                              <SelectItem value="San Roque">San Roque</SelectItem>
                              <SelectItem value="Silangan">Silangan</SelectItem>
                              <SelectItem value="Socorro">Socorro</SelectItem>
                              <SelectItem value="Tagumpay">Tagumpay</SelectItem>
                              <SelectItem value="Ugong Norte">Ugong Norte</SelectItem>
                              <SelectItem value="Villa Maria Clara">Villa Maria Clara</SelectItem>
                              <SelectItem value="West Kamias">West Kamias</SelectItem>
                              <SelectItem value="White Plains">White Plains</SelectItem>
                            </>
                          )}
                          {district === "District 4" && (
                            <>
                              <SelectItem value="Bagong Lipunan ng Crame">Bagong Lipunan ng Crame (Camp Crame)</SelectItem>
                              <SelectItem value="Botocan">Botocan (Diliman - northern half)</SelectItem>
                              <SelectItem value="Central">Central (Diliman)</SelectItem>
                              <SelectItem value="Damayang Lagi">Damayang Lagi</SelectItem>
                              <SelectItem value="Don Manuel">Don Manuel</SelectItem>
                              <SelectItem value="Doña Aurora">Doña Aurora</SelectItem>
                              <SelectItem value="Doña Imelda">Doña Imelda</SelectItem>
                              <SelectItem value="Doña Josefa">Doña Josefa</SelectItem>
                              <SelectItem value="Horseshoe">Horseshoe</SelectItem>
                              <SelectItem value="Immaculate Conception">Immaculate Conception</SelectItem>
                              <SelectItem value="Kalusugan">Kalusugan</SelectItem>
                              <SelectItem value="Kamuning">Kamuning</SelectItem>
                              <SelectItem value="Kaunlaran">Kaunlaran</SelectItem>
                              <SelectItem value="Kristong Hari">Kristong Hari</SelectItem>
                              <SelectItem value="Krus na Ligas">Krus na Ligas</SelectItem>
                              <SelectItem value="Laging Handa">Laging Handa</SelectItem>
                              <SelectItem value="Malaya">Malaya</SelectItem>
                              <SelectItem value="Mariana">Mariana</SelectItem>
                              <SelectItem value="Obrero">Obrero (Diliman - northern half)</SelectItem>
                              <SelectItem value="Old Capitol Site">Old Capitol Site</SelectItem>
                              <SelectItem value="Paligsahan">Paligsahan</SelectItem>
                              <SelectItem value="Pinagkaisahan">Pinagkaisahan</SelectItem>
                              <SelectItem value="Pinyahan">Pinyahan</SelectItem>
                              <SelectItem value="Roxas">Roxas</SelectItem>
                              <SelectItem value="Sacred Heart">Sacred Heart</SelectItem>
                              <SelectItem value="San Isidro">San Isidro</SelectItem>
                              <SelectItem value="San Martin de Porres">San Martin de Porres</SelectItem>
                              <SelectItem value="San Vicente">San Vicente</SelectItem>
                              <SelectItem value="Santol">Santol</SelectItem>
                              <SelectItem value="Sikatuna Village">Sikatuna Village</SelectItem>
                              <SelectItem value="South Triangle">South Triangle</SelectItem>
                              <SelectItem value="Sto. Niño">Sto. Niño</SelectItem>
                              <SelectItem value="Tatalon">Tatalon (Sanctuarium)</SelectItem>
                              <SelectItem value="Teacher's Village East">Teacher's Village East (Diliman)</SelectItem>
                              <SelectItem value="Teacher's Village West">Teacher's Village West (Diliman)</SelectItem>
                              <SelectItem value="U.P. Campus">U.P. Campus</SelectItem>
                              <SelectItem value="U.P. Village">U.P. Village</SelectItem>
                              <SelectItem value="Valencia">Valencia</SelectItem>
                            </>
                          )}
                          {district === "District 5" && (
                            <>
                              <SelectItem value="Bagbag">Bagbag</SelectItem>
                              <SelectItem value="Capri">Capri</SelectItem>
                              <SelectItem value="Fairview">Fairview</SelectItem>
                              <SelectItem value="Gulod">Gulod</SelectItem>
                              <SelectItem value="Greater Lagro">Greater Lagro</SelectItem>
                              <SelectItem value="Kaligayahan">Kaligayahan</SelectItem>
                              <SelectItem value="Nagkaisang Nayon">Nagkaisang Nayon</SelectItem>
                              <SelectItem value="North Fairview">North Fairview</SelectItem>
                              <SelectItem value="Novaliches Proper">Novaliches Proper</SelectItem>
                              <SelectItem value="Pasong Putik Proper">Pasong Putik Proper</SelectItem>
                              <SelectItem value="San Agustin">San Agustin</SelectItem>
                              <SelectItem value="San Bartolome">San Bartolome</SelectItem>
                              <SelectItem value="Sta. Lucia">Sta. Lucia</SelectItem>
                              <SelectItem value="Sta. Monica">Sta. Monica</SelectItem>
                            </>
                          )}
                          {district === "District 6" && (
                            <>
                              <SelectItem value="Apolonio Samson">Apolonio Samson</SelectItem>
                              <SelectItem value="Baesa">Baesa</SelectItem>
                              <SelectItem value="Balong Bato">Balong Bato</SelectItem>
                              <SelectItem value="Culiat">Culiat</SelectItem>
                              <SelectItem value="New Era">New Era</SelectItem>
                              <SelectItem value="Sangandaan">Sangandaan</SelectItem>
                              <SelectItem value="Sauyo">Sauyo</SelectItem>
                              <SelectItem value="Talipapa">Talipapa</SelectItem>
                              <SelectItem value="Tandang Sora">Tandang Sora</SelectItem>
                              <SelectItem value="Unang Sigaw">Unang Sigaw</SelectItem>
                            </>
                          )}
                        </>

                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-1 mt-5 gap-3">
                  {!showInput ? (
                    <Select value={street} onValueChange={setStreet}>
                      <SelectTrigger className="">
                        <SelectValue placeholder="Select a street" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Barangay</SelectLabel>
                          {renderStreetOptions()}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  ) :
                    <Input
                      type="text"
                      value={street}
                      onChange={(e) => setStreet(e.target.value)}
                      placeholder="Enter your street"
                    />
                  }

                  {!showInput ? (
                    <p className="text-sm text-muted-foreground cursor-pointer underline" onClick={() => {
                      setShowInput(true)
                    }}>
                      Can't see your street? Click here!
                    </p>
                  ) :
                    <p className="text-sm text-muted-foreground cursor-pointer underline" onClick={() => {
                      setShowInput(false)
                    }}>
                      Go back to dropdown selection!
                    </p>
                  }
                </div>

                <Input placeholder="Address" value={"Quezon City"} disabled={true} />

                <FormField
                  control={form.control}
                  name="zip"
                  render={({ field }) => (
                    <FormItem className="">
                      <FormLabel>Zip Code</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter zip code..." {...field} type="number" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="terms"
                  render={({ field }) => (
                    <FormItem className="flex flex-col w-full h-full items-center gap-2">
                      <div className="flex flex-row gap-2 mt-1">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <FormDescription>
                          I accept all {" "}
                          <Link href="/terms-and-condition" className="underline text-[#1916C1]">terms & conditions</Link>
                        </FormDescription>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}


            <FormError message={error} />
            <FormSuccess message={success} />
            {formStep === 2 && (
              <div className="grid grid-cols-2 gap-3">
                <Button
                  type="submit"
                  className="w-full"
                  variant="primary"
                  onClick={() => setFormStep(1)}
                >
                  Go back
                </Button>

                <Button
                  disabled={isPending}
                  type="submit"
                  className="w-full"
                  variant="primary"
                >
                  Create an account
                </Button>
              </div>
            )}

          </form>
        </Form>

        <CardFooter>
          <BackButton
            label="Already have an account?"
            href="/login"
          />
        </CardFooter>
      </Card>
    </div>
  );
};