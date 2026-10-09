/**
 * Palvelusivujen sisältö. Jokaisella palvelulla on oma, erillinen sisältönsä –
 * älä kopioi tekstejä sivulta toiselle (ohut, toistuva sisältö heikentää
 * hakunäkyvyyttä ja käyttäjäkokemusta).
 */

export type ServiceSlug =
  | "hanan-vaihto"
  | "wc-istuimen-vaihto"
  | "vesivuodon-korjaus"
  | "viemarin-avaus"
  | "pesukoneen-asennus"
  | "astianpesukoneen-asennus"
  | "putkistojen-huolto"
  | "kayttovesiputkien-uusiminen"
  | "putkiremontit"
  | "paivystava-putkimies";

export type ServiceIcon =
  | "faucet"
  | "toilet"
  | "leak"
  | "drain"
  | "washer"
  | "dishwasher"
  | "maintenance"
  | "pipes"
  | "renovation"
  | "emergency";

/** Osion lista näytetään ennen kappaleita: kappaleet toimivat listan jälkeisinä huomioina. */
export interface ContentSection {
  heading: string;
  paragraphs?: string[];
  list?: string[];
}

export interface FaqItem {
  q: string;
  a: string;
}

export interface Service {
  slug: ServiceSlug;
  /** Sivun H1 ja palvelun koko nimi */
  name: string;
  /** Lyhyt nimi korteissa ja valikoissa */
  shortName: string;
  icon: ServiceIcon;
  /** Polku – päivystyssivu on juuritasolla, muut /putkipalvelut/ alla */
  href: string;
  metaTitle: string;
  metaDescription: string;
  cardText: string;
  intro: string;
  sections: ContentSection[];
  priceFactors: string[];
  beforeOrdering: string[];
  faq: FaqItem[];
  related: ServiceSlug[];
}

export const services: Service[] = [
  {
    slug: "hanan-vaihto",
    name: "Hanakorjaus ja hanan vaihto Helsingissä",
    shortName: "Hanan vaihto",
    icon: "faucet",
    href: "/putkipalvelut/hanan-vaihto",
    metaTitle: "Hanan vaihto ja hanakorjaus Helsingissä – hinta ja vinkit",
    metaDescription:
      "Tippuuko hana tai onko sekoittaja rikki? Lue, milloin hana kannattaa korjata ja milloin vaihtaa, mitä työ maksaa Helsingissä ja mitä tarkistaa ennen tilausta.",
    cardText: "Tippuva, jäykkä tai vuotava hana. Korjaus tai uuden sekoittajan asennus.",
    intro:
      "Tippuva keittiöhana tai suihkusekoittaja, jonka lämpötila ei pysy tasaisena, on yksi yleisimmistä syistä soittaa putkimiehelle. Usein vika on tiivisteessä tai patruunassa, ja korjaus on nopea. Vanhan tai kalkkiintuneen hanan kohdalla vaihto on kuitenkin usein järkevämpi ratkaisu.",
    sections: [
      {
        heading: "Korjata vai vaihtaa?",
        paragraphs: [
          "Jos hana on alle kymmenen vuotta vanha ja vika rajoittuu tippumiseen, korjaus kannattaa yleensä selvittää ensin. Monien merkkien varaosia, kuten patruunoita ja tiivisteitä, on saatavilla vielä vuosia mallin myynnin jälkeen.",
          "Vaihto on usein järkevämpi, kun hanan runko vuotaa, varaosia ei enää saa tai hana on niin kalkkiintunut, ettei korjaus pysy kunnossa. Samalla voi miettiä, tarvitaanko astianpesukoneelle venttiiliä tai halutaanko suihkuun termostaattisekoittaja.",
        ],
      },
      {
        heading: "Mitä hanan vaihtoon kuuluu",
        list: [
          "veden sulkeminen kohteen sulkuventtiileistä tai tarvittaessa koko asunnosta",
          "vanhan hanan irrotus ja liitäntöjen tarkistus",
          "uuden hanan asennus ja liitäntäletkujen tai -putkien kytkentä",
          "tiiviyden koeponnistus ja toiminnan testaus",
          "vanhan hanan pois vieminen, jos siitä on sovittu",
        ],
      },
      {
        heading: "Kerrostalossa ilmoita taloyhtiölle",
        paragraphs: [
          "Asunto-osakeyhtiössä osakkaan on ilmoitettava taloyhtiölle muutostöistä, jotka voivat vaikuttaa yhtiön rakenteisiin tai järjestelmiin. Monissa taloyhtiöissä myös vesikalusteiden vaihdosta pyydetään ilmoitus ennen työn aloittamista. Tarkista käytäntö isännöitsijältä – erityisesti, jos vettä joudutaan sulkemaan koko porraskäytävästä.",
        ],
      },
    ],
    priceFactors: [
      "korjataanko vanhaa hanaa vai asennetaanko uusi",
      "hankkiiko asiakas hanan itse vai tuoko putkimies sen",
      "jumittuneet tai kuluneet sulkuventtiilit, jotka täytyy vaihtaa samalla",
      "hanan tyyppi: allas-, seinä- ja termostaattihanojen asennus vie eri ajan",
      "tarvitaanko astianpesukoneelle oma venttiili",
    ],
    beforeOrdering: [
      "Ota kuva nykyisestä hanasta ja sen liitännöistä altaan alta.",
      "Selvitä, toimivatko asunnon tai kalusteen sulkuventtiilit.",
      "Jos ostat hanan itse, kysy etukäteen, sopiiko malli nykyisiin liitäntöihin.",
    ],
    faq: [
      {
        q: "Voinko vaihtaa hanan itse?",
        a: "Moni osaa vaihtaa hanan, mutta virheellinen liitäntä voi aiheuttaa vesivahingon. Kotivakuutus voi jättää korvauksen osin tai kokonaan maksamatta, jos vahinko johtuu maallikon tekemästä asennuksesta. Tarkista oman vakuutuksesi ehdot ja taloyhtiön ohjeet ennen kuin teet työn itse.",
      },
      {
        q: "Kauanko hanan vaihto kestää?",
        a: "Tavallisen allas- tai keittiöhanan vaihto on usein noin tunnin työ, kun sulkuventtiilit toimivat ja liitännät ovat vakiomittaisia. Jumiutuneet venttiilit tai poikkeavat liitännät pidentävät työtä.",
      },
    ],
    related: ["wc-istuimen-vaihto", "astianpesukoneen-asennus", "vesivuodon-korjaus"],
  },
  {
    slug: "wc-istuimen-vaihto",
    name: "WC-istuimen korjaus ja vaihto Helsingissä",
    shortName: "WC-istuimen vaihto",
    icon: "toilet",
    href: "/putkipalvelut/wc-istuimen-vaihto",
    metaTitle: "WC-istuimen vaihto ja korjaus Helsingissä – hinta ja ohjeet",
    metaDescription:
      "Valuuko WC jatkuvasti tai vuotaako istuin lattiaan? Katso, mitkä viat voi korjata, milloin WC-istuin kannattaa vaihtaa ja mistä hinta Helsingissä muodostuu.",
    cardText: "Jatkuvasti valuva säiliö, vuotava liitos tai koko istuimen vaihto.",
    intro:
      "Jatkuvasti valuva WC kuluttaa huomaamatta paljon vettä, ja istuimen juuresta tihkuva vuoto voi kastella lattiarakenteita pitkään ennen kuin se näkyy. Moni vika korjautuu vaihtamalla säiliön sisäosat, mutta vanhan tai haljenneen istuimen kohdalla vaihto on yleensä kestävämpi ratkaisu.",
    sections: [
      {
        heading: "Yleisimmät viat",
        list: [
          "säiliö valuu jatkuvasti altaaseen – usein täyttöventtiilin tai huuhtelumekanismin vika",
          "säiliö täyttyy hitaasti tai ei lainkaan",
          "istuimen ja viemärin liitos vuotaa",
          "posliinissa on halkeama",
          "huuhtelu on heikko tai tukkeutuu toistuvasti",
        ],
      },
      {
        heading: "Vaihdossa huomioitavaa",
        paragraphs: [
          "Uutta istuinta valitessa tärkeintä on viemäriliitännän suunta ja paikka: lattia- ja seinäliitäntäiset istuimet eivät ole keskenään vaihdettavissa ilman muutostöitä. Myös istuimen syvyys ja kiinnityspisteet vaikuttavat siihen, jääkö lattiaan näkyviä jälkiä vanhasta istuimesta.",
          "Jos lattian vedeneristys on vanha tai istuimen ympärillä on merkkejä kosteudesta, vaihdon yhteydessä kannattaa pyytää kosteusmittaus. Silloin mahdollinen piilevä vaurio löytyy ennen kuin uusi istuin peittää sen.",
        ],
      },
    ],
    priceFactors: [
      "säiliön sisäosien korjaus vai koko istuimen vaihto",
      "liitäntätyyppi ja tarvittavat sovitusosat",
      "istuimen kiinnitys: ruuvit, liimaus tai seinäkiinnitteinen kehikko",
      "vanhan istuimen purku ja kierrätys",
      "mahdolliset kosteusvauriot lattiassa",
    ],
    beforeOrdering: [
      "Katso istuimen takaa, lähteekö viemäriliitäntä lattiaan vai seinään.",
      "Ota kuva istuimesta ja liitännöistä tarjouspyyntöä varten.",
      "Kerro, haluatko putkimiehen hankkivan uuden istuimen vai ostatko sen itse.",
    ],
    faq: [
      {
        q: "Paljonko jatkuvasti valuva WC kuluttaa vettä?",
        a: "Määrä vaihtelee vuodon voimakkuuden mukaan, mutta pienikin jatkuva valuma voi kerryttää satoja litroja vuorokaudessa. Vuodon huomaa esimerkiksi tiputtamalla säiliöön elintarvikeväriä: jos väri näkyy altaassa ilman huuhtelua, säiliö vuotaa.",
      },
      {
        q: "Riittääkö pelkän säiliön sisäosien vaihto?",
        a: "Usein riittää, jos vika on täyttö- tai huuhteluventtiilissä ja istuin on muuten ehjä. Vanhoihin malleihin sopivia osia ei kuitenkaan aina löydy, jolloin vaihto voi tulla edullisemmaksi kuin sovittaminen.",
      },
    ],
    related: ["viemarin-avaus", "vesivuodon-korjaus", "hanan-vaihto"],
  },
  {
    slug: "vesivuodon-korjaus",
    name: "Vesivuodon korjaus Helsingissä",
    shortName: "Vesivuodon korjaus",
    icon: "leak",
    href: "/putkipalvelut/vesivuodon-korjaus",
    metaTitle: "Vesivuodon korjaus Helsingissä – toimi näin vuodon sattuessa",
    metaDescription:
      "Vesivuoto kotona? Lue, miten toimit heti, keneen otat yhteyttä kerrostalossa ja omakotitalossa, ja mitä vuodon korjaus Helsingissä voi maksaa.",
    cardText: "Vuotava putki, liitos tai vesilukko. Ensiapuohjeet ja korjaus.",
    intro:
      "Vesivuodossa nopeus ratkaisee: mitä aiemmin vesi saadaan poikki, sitä pienemmäksi vahinko jää. Tällä sivulla kerrotaan, miten toimia heti vuodon huomattua, keneen ottaa yhteyttä ja mitä korjauksessa yleensä tehdään.",
    sections: [
      {
        heading: "Toimi heti näin",
        list: [
          "Sulje vesi lähimmästä sulkuventtiilistä tai asunnon pääsulusta.",
          "Jos vettä on päässyt sähkölaitteisiin tai pistorasioihin, katkaise virta sähkökeskuksesta, jos se on turvallista.",
          "Kerää vesi talteen ja kuivaa näkyvät pinnat.",
          "Valokuvaa vuotokohta ja vahingot vakuutusyhtiötä varten.",
          "Kerrostalossa ilmoita vuodosta heti taloyhtiön huoltoyhtiön päivystykseen – vuoto voi edetä naapuriin tai rakenteisiin.",
        ],
      },
      {
        heading: "Kuka korjaa ja kuka maksaa?",
        paragraphs: [
          "Asunto-osakeyhtiössä vastuu jakautuu asunto-osakeyhtiölain ja yhtiöjärjestyksen mukaan: taloyhtiö vastaa yleensä rakenteista ja yhteisistä putkistoista, osakas asunnon sisäisistä varusteista ja omista muutostöistään. Siksi kerrostalossa ensimmäinen soitto kannattaa yleensä tehdä huoltoyhtiöön, joka tuntee kiinteistön.",
          "Omakotitalossa vastuu on omistajalla, ja putkimiehen voi tilata suoraan. Ilmoita vahingosta myös kotivakuutusyhtiöön mahdollisimman pian.",
        ],
      },
      {
        heading: "Piilovuodon merkit",
        list: [
          "vesimittari pyörii, vaikka yhtään hanaa ei ole auki",
          "lattiassa, seinässä tai kaapin pohjassa on tummuneita kohtia tai turpoamista",
          "huoneessa on tunkkainen tai maakellarimainen haju",
          "vesilasku nousee ilman selvää syytä",
        ],
      },
    ],
    priceFactors: [
      "vuotokohdan löytäminen: näkyvä liitos on nopea, rakenteen sisällä oleva vuoto hidas",
      "tarvitaanko kosteusmittausta, lämpökameraa tai rakenteiden avaamista",
      "kiireellisyys: ilta-, yö- ja viikonloppukäynnit maksavat selvästi enemmän",
      "kuivatus ja jälkikorjaukset, jotka tilataan yleensä erikseen",
    ],
    beforeOrdering: [
      "Sulje vesi ennen kuin soitat – näin voit odottaa myös arkiaamua kalliimman päivystyksen sijaan, jos tilanne sen sallii.",
      "Kerrostalossa selvitä ensin huoltoyhtiön kanssa, kuka korjauksen tilaa.",
      "Kysy putkiliikkeeltä, sisältyykö mahdollinen kosteusmittaus hintaan.",
    ],
    faq: [
      {
        q: "Korvaako kotivakuutus vesivuodon?",
        a: "Äkillisen ja ennalta arvaamattoman vuodon aiheuttamat vahingot korvataan usein, mutta itse vuotaneen osan korjausta tai pitkään jatkuneen tihkuvuodon vahinkoja ei välttämättä. Korvaus riippuu vakuutusehdoista – ota yhteys vakuutusyhtiöön ennen korjausten aloittamista.",
      },
      {
        q: "Pitääkö vesivuoto korjata heti yöllä?",
        a: "Jos vesi saadaan suljettua eikä vuoto jatku, korjaus voi usein odottaa arkipäivään. Jos vettä ei saa poikki tai vuoto uhkaa naapureita tai sähkölaitteita, päivystys on perusteltu.",
      },
    ],
    related: ["paivystava-putkimies", "putkistojen-huolto", "wc-istuimen-vaihto"],
  },
  {
    slug: "viemarin-avaus",
    name: "Viemärin avaus Helsingissä",
    shortName: "Viemärin avaus",
    icon: "drain",
    href: "/putkipalvelut/viemarin-avaus",
    metaTitle: "Viemärin avaus Helsingissä – tukos lavuaarissa, suihkussa tai WC:ssä",
    metaDescription:
      "Tukkeutunut viemäri? Lue, mitä voit kokeilla itse, milloin tarvitaan viemärin avaus koneella ja mistä viemärinavauksen hinta Helsingissä muodostuu.",
    cardText: "Tukkeutunut lavuaari, suihku, lattiakaivo tai WC.",
    intro:
      "Hitaasti vetävä lavuaari tai suihku, jonka lattiakaivoon jää vettä seisomaan, on merkki kasvavasta tukoksesta. Pinnalla olevan tukoksen voi usein poistaa itse, mutta syvemmällä putkistossa oleva tukos vaatii viemärinavauskoneen tai painehuuhtelun.",
    sections: [
      {
        heading: "Mitä voit kokeilla itse",
        list: [
          "Puhdista lattiakaivon kansi ja hajulukko hiuksista ja saippuajäämistä.",
          "Irrota lavuaarin vesilukko ämpärin päällä ja puhdista se.",
          "Kokeile imukuppia – tukitse ylivuotoaukko kostealla liinalla, jotta imu tehoaa.",
        ],
        paragraphs: [
          "Vahvoja kemiallisia viemärinavaajia kannattaa käyttää harkiten: ne voivat vaurioittaa vanhoja putkia ja tiivisteitä, eivätkä ne yleensä liuota kiinteitä tukoksia. Jos tukos ei aukea, soita ammattilaiselle ennen kuin kokeilet useita aineita päällekkäin.",
        ],
      },
      {
        heading: "Milloin tarvitaan ammattilaista",
        paragraphs: [
          "Jos useampi kaivo tai viemäri on tukossa samanaikaisesti tai vesi nousee lattiakaivosta toista viemäriä käytettäessä, tukos on todennäköisesti asunnon tai talon yhteisessä viemärissä. Kerrostalossa ilmoita tästä huoltoyhtiöön.",
          "Toistuvien tukosten syy selviää usein viemärin kuvauksella. Kamera näyttää, onko putkessa painuma, juurtuma tai rikkoutunut kohta, jota pelkkä avaus ei korjaa.",
        ],
      },
    ],
    priceFactors: [
      "tukoksen sijainti ja syvyys putkistossa",
      "käytettävä laitteisto: pieni tai iso avauskone, painepesuri",
      "viemärin kuvaus, jos tukoksia esiintyy toistuvasti",
      "ajankohta: päivystyskäynti nostaa hintaa merkittävästi",
    ],
    beforeOrdering: [
      "Kerro, mikä viemäri on tukossa ja onko tukoksia useammassa paikassa.",
      "Kysy, laskutetaanko avauskone tai muu erikoislaite erikseen – osa putkiliikkeistä veloittaa niistä käyntikohtaisen maksun.",
      "Kerrostalossa varmista ensin, onko kyse yhteisestä viemäristä.",
    ],
    faq: [
      {
        q: "Kuka maksaa viemärin avauksen kerrostalossa?",
        a: "Se riippuu tukoksen sijainnista ja syystä. Asunnon oman vesilukon tai lattiakaivon tukos on yleensä osakkaan vastuulla, yhteisen runkolinjan tukos taloyhtiön. Huoltoyhtiö osaa yleensä arvioida tilanteen.",
      },
      {
        q: "Miksi viemäri haisee, vaikka se vetää?",
        a: "Haju johtuu usein kuivuneesta tai likaisesta vesilukosta, joka ei enää estä viemärikaasujen nousua. Juoksuta vettä harvoin käytettyihin kaivoihin ja puhdista vesilukot säännöllisesti. Jos haju jatkuu, syy voi olla tuuletusputkessa tai vuotavassa liitoksessa.",
      },
    ],
    related: ["putkistojen-huolto", "wc-istuimen-vaihto", "paivystava-putkimies"],
  },
  {
    slug: "pesukoneen-asennus",
    name: "Pesukoneen asennus Helsingissä",
    shortName: "Pesukoneen asennus",
    icon: "washer",
    href: "/putkipalvelut/pesukoneen-asennus",
    metaTitle: "Pesukoneen asennus Helsingissä – liitännät, hinta ja vakuutus",
    metaDescription:
      "Pyykinpesukoneen asennus vaatii toimivan venttiilin, oikean poistoliitännän ja tarvittaessa vuotosuojan. Lue, mitä tarkistaa ja mistä hinta muodostuu.",
    cardText: "Uuden pesukoneen kytkentä ja vesi- ja poistoliitännät.",
    intro:
      "Pesukoneen vaihto vanhan tilalle on usein suoraviivainen työ, jos liitännät ovat valmiina ja kunnossa. Kun kone siirretään uuteen paikkaan tai liitännät puuttuvat, tarvitaan putkitöitä – ja silloin ammattilaisen tekemä asennus on vesivahinkojen kannalta perusteltu.",
    sections: [
      {
        heading: "Tarkista ennen asennusta",
        list: [
          "Onko koneelle oma sulkuventtiili, ja toimiiko se?",
          "Johdetaanko poistovesi lattiakaivoon, vesilukkoon vai erilliseen liitäntään?",
          "Onko lattiassa kaivo tai vuotokaukalo vuodon varalta?",
          "Mahtuuko kone paikalleen niin, ettei letku jää taitteelle?",
        ],
      },
      {
        heading: "Vuotosuojaus ja vakuutus",
        paragraphs: [
          "Pesukoneen tuloletkun rikkoutuminen on tavallinen vesivahingon syy. Monet vakuutusyhtiöt edellyttävät, että kone asennetaan valmistajan ohjeiden mukaan ja vesi suljetaan, kun konetta ei käytetä. Jos kone sijaitsee tilassa, jossa ei ole lattiakaivoa, vuotokaukalo tai automaattinen vuotovahti pienentää riskiä.",
          "Tarkista oman kotivakuutuksesi ehdot – vaatimukset vaihtelevat yhtiöittäin.",
        ],
      },
    ],
    priceFactors: [
      "korvaako kone vanhan samalla paikalla vai tarvitaanko uudet liitännät",
      "uusi sulkuventtiili, tuloletku tai poistoliitäntä",
      "vuotokaukalon tai vuotovahdin asennus",
      "vanhan koneen irrotus ja poisvienti, jos se tilataan samalla",
    ],
    beforeOrdering: [
      "Valokuvaa nykyiset liitännät ja koneen paikka.",
      "Kysy, sisältyykö kuljetussuojien poisto ja koneen vaaitus asennukseen.",
      "Jos kone siirtyy uuteen paikkaan, kerrostalossa varmista muutostyöilmoituksen tarve taloyhtiöltä.",
    ],
    faq: [
      {
        q: "Saako pesukoneen asentaa itse?",
        a: "Valmiisiin liitäntöihin kytkeminen onnistuu monelta, mutta vakuutusyhtiöt edellyttävät asianmukaista asennusta. Uusien liitäntöjen rakentaminen kannattaa jättää putkiasentajalle.",
      },
      {
        q: "Tarvitseeko pesukone oman venttiilin?",
        a: "Pesukoneelle suositellaan omaa, helposti suljettavaa venttiiliä. Sen avulla vesi on helppo sulkea koneen ollessa käyttämättä ja vuodon sattuessa.",
      },
    ],
    related: ["astianpesukoneen-asennus", "vesivuodon-korjaus", "viemarin-avaus"],
  },
  {
    slug: "astianpesukoneen-asennus",
    name: "Astianpesukoneen asennus Helsingissä",
    shortName: "Astianpesukoneen asennus",
    icon: "dishwasher",
    href: "/putkipalvelut/astianpesukoneen-asennus",
    metaTitle: "Astianpesukoneen asennus Helsingissä – liitännät ja hinta",
    metaDescription:
      "Astianpesukoneen asennus vaatii venttiilin, poistoliitännän ja vuotosuojauksen. Lue, mitä työ sisältää, mihin varautua ja mistä hinta Helsingissä muodostuu.",
    cardText: "Uuden tai integroitavan astianpesukoneen kytkentä ja liitännät.",
    intro:
      "Astianpesukone kytketään yleensä keittiöhanan venttiiliin ja altaan vesilukkoon. Vaihto vanhan tilalle on yleensä nopea, mutta ensimmäinen asennus keittiöön, jossa liitäntöjä ei ole, vaatii hanan venttiilin tai vesilukon vaihtoa.",
    sections: [
      {
        heading: "Mitä asennukseen yleensä kuuluu",
        list: [
          "tuloveden kytkentä hanan astianpesukoneventtiiliin tai erilliseen venttiiliin",
          "poistoletkun liitos vesilukkoon niin, ettei likavesi pääse virtaamaan takaisin",
          "koneen vaaitus ja kiinnitys kalusteisiin",
          "vuotokaukalon tai vuotovahdin asennus, jos se on sovittu",
          "koeajo ja liitosten tarkistus",
        ],
      },
      {
        heading: "Integroitavat koneet",
        paragraphs: [
          "Kalusteisiin upotettava kone vaatii myös ovilevyn kiinnityksen ja tarkan mitoituksen. Putkiasentaja tekee vesi- ja viemäriliitännät; ovilevyn kiinnitys ja kalustemuutokset voivat olla erillinen työ. Kysy etukäteen, mitä hintaan sisältyy.",
        ],
      },
    ],
    priceFactors: [
      "onko hanassa valmiina astianpesukoneventtiili",
      "tarvitaanko uusi vesilukko poistoliitäntää varten",
      "integroitavan koneen ovilevyn ja kalusteiden sovitus",
      "vuotokaukalo ja vuotovahti",
    ],
    beforeOrdering: [
      "Katso, onko keittiöhanan rungossa erillinen venttiili astianpesukonetta varten.",
      "Tarkista koneen mitat ja kalusteaukon koko.",
      "Kysy, viekö asentaja vanhan koneen pois.",
    ],
    faq: [
      {
        q: "Tarvitseeko astianpesukone vuotokaukalon?",
        a: "Vuotokaukalo tai vuotovahti suojaa kalusteita ja lattiaa koneen vuotaessa. Vakuutusyhtiöiden vaatimukset vaihtelevat, joten tarkista oman yhtiösi ehdot.",
      },
      {
        q: "Voiko astianpesukoneen liittää ilman hanaventtiiliä?",
        a: "Voi, mutta silloin tarvitaan erillinen venttiili tuloputkeen. Usein helpompi ratkaisu on vaihtaa hana malliin, jossa venttiili on valmiina.",
      },
    ],
    related: ["hanan-vaihto", "pesukoneen-asennus", "vesivuodon-korjaus"],
  },
  {
    slug: "putkistojen-huolto",
    name: "Putkistojen huolto Helsingissä",
    shortName: "Putkistojen huolto",
    icon: "maintenance",
    href: "/putkipalvelut/putkistojen-huolto",
    metaTitle: "Putkistojen huolto Helsingissä – ennakoi vuodot ja tukokset",
    metaDescription:
      "Säännöllinen huolto pidentää putkiston käyttöikää. Lue, mitä putkiston huollossa tarkistetaan ja mitä asukas voi tehdä itse Helsingissä.",
    cardText: "Venttiilien, vesilukkojen ja liitosten tarkistus ennen kuin vika syntyy.",
    intro:
      "Suurin osa vesivahingoista syntyy osista, joiden kunto olisi ollut tarkistettavissa etukäteen: jumittuneista sulkuventtiileistä, haurastuneista letkuista ja kalkkiintuneista liitoksista. Ennakoiva huolto on yleensä selvästi edullisempaa kuin vesivahingon korjaus.",
    sections: [
      {
        heading: "Mitä huollossa tarkistetaan",
        list: [
          "sulkuventtiilien toiminta – jumittunutta venttiiliä ei saa kiinni hätätilanteessa",
          "kodinkoneiden letkut ja liitokset",
          "vesilukkojen ja lattiakaivojen kunto ja puhtaus",
          "näkyvien putkien ja liitosten korroosio ja tihkuvuodot",
          "lämminvesivaraajan varoventtiili ja ikä omakotitalossa",
        ],
      },
      {
        heading: "Mitä voit tehdä itse",
        paragraphs: [
          "Avaa ja sulje asunnon sulkuventtiilit pari kertaa vuodessa, jotta ne eivät jumiudu. Puhdista lattiakaivot ja vesilukot säännöllisesti ja juoksuta vettä harvoin käytettyihin pisteisiin. Lue vesimittari illalla ja aamulla, kun vettä ei ole käytetty – jos lukema muuttuu, jossain on vuoto.",
        ],
      },
      {
        heading: "Kerrostalo ja omakotitalo",
        paragraphs: [
          "Kerrostalossa yhteisten putkistojen huolto kuuluu taloyhtiölle, mutta asunnon omat varusteet, kuten hanat ja kodinkoneiden liitännät, ovat usein osakkaan vastuulla. Omakotitalossa koko putkiston kunnossapito on omistajan vastuulla.",
        ],
      },
    ],
    priceFactors: [
      "kohteen koko ja tarkistettavien pisteiden määrä",
      "havaittujen vikojen korjaukset samalla käynnillä",
      "erikoislaitteet, kuten viemärin kuvaus tai kosteusmittaus",
    ],
    beforeOrdering: [
      "Listaa kaikki havaitut pikkuviat yhdelle käynnille – yksi lähtömaksu on edullisempi kuin useampi.",
      "Kysy, onko huoltokäynnille kiinteä hinta vai laskutetaanko tuntityönä.",
    ],
    faq: [
      {
        q: "Kuinka usein putkisto pitäisi huoltaa?",
        a: "Yleistä ohjetta ei ole, mutta sulkuventtiilien ja kodinkoneiden liitosten tarkistaminen kerran vuodessa on hyvä käytäntö. Vanhoissa kiinteistöissä tarkistuksia kannattaa tehdä useammin.",
      },
    ],
    related: ["vesivuodon-korjaus", "viemarin-avaus", "kayttovesiputkien-uusiminen"],
  },
  {
    slug: "kayttovesiputkien-uusiminen",
    name: "Käyttövesiputkien uusiminen Helsingissä",
    shortName: "Käyttövesiputkien uusiminen",
    icon: "pipes",
    href: "/putkipalvelut/kayttovesiputkien-uusiminen",
    metaTitle: "Käyttövesiputkien uusiminen – milloin ja miten | Helsinki",
    metaDescription:
      "Milloin käyttövesiputket pitää uusia ja millaisia vaihtoehtoja on? Lue putkien uusimisesta, pinnoituksesta ja pinta-asennuksista omakoti- ja kerrostalossa.",
    cardText: "Vanhentuneiden vesiputkien vaihto tai pinnoitus.",
    intro:
      "Käyttövesiputkilla tarkoitetaan kylmän ja lämpimän veden putkia hanoille ja vesikalusteille. Kun putkisto vanhenee, korroosio, heikentynyt vedenpaine ja toistuvat vuodot kertovat, että uusiminen tulee ajankohtaiseksi.",
    sections: [
      {
        heading: "Merkit uusimisen tarpeesta",
        list: [
          "toistuvat pienet vuodot eri kohdissa putkistoa",
          "ruskea tai sameaa vettä erityisesti aamuisin",
          "heikentynyt vedenpaine useammassa vesipisteessä",
          "kuntotutkimus tai -arvio, jossa putkiston arvioidaan tulleen käyttöikänsä päähän",
        ],
      },
      {
        heading: "Toteutustavat",
        paragraphs: [
          "Perinteisessä uusimisessa vanhat putket korvataan uusilla, usein pinta-asennuksena. Pinta-asennus on nopeampi ja helpompi huoltaa, mutta näkyvät putket on otettava huomioon sisustuksessa. Seinien sisään asennettavat putket vaativat enemmän rakennustyötä.",
          "Pinnoituksessa vanhojen putkien sisäpinta käsitellään, eikä putkia vaihdeta. Menetelmä on nopeampi, mutta sen soveltuvuus riippuu putkiston kunnosta. Pyydä aina riippumaton kuntoarvio ennen kuin valitset menetelmää.",
        ],
      },
      {
        heading: "Kerrostalossa päätös tehdään yhtiössä",
        paragraphs: [
          "Kerrostalon käyttövesiputkien uusiminen kuuluu yleensä taloyhtiön vastuulle, ja siitä päätetään yhtiökokouksessa osana putkiremonttia. Yksittäinen osakas ei voi uusia yhteisiä putkia omin päin. Omakotitalossa omistaja päättää ajankohdasta ja menetelmästä itse.",
        ],
      },
    ],
    priceFactors: [
      "putkiston laajuus ja vesipisteiden määrä",
      "menetelmä: uudet putket, pinta-asennus vai pinnoitus",
      "rakenteiden avaamis- ja jälkityöt",
      "kuntotutkimus ja suunnittelu",
    ],
    beforeOrdering: [
      "Tilaa kuntoarvio ennen urakkatarjousten pyytämistä.",
      "Pyydä tarjoukset samasta laajuudesta, jotta ne ovat vertailukelpoisia.",
      "Varmista, mitkä jälkityöt (laatoitus, maalaus) sisältyvät urakkaan.",
    ],
    faq: [
      {
        q: "Kuinka kauan vesiputket kestävät?",
        a: "Käyttöikä riippuu putkimateriaalista, veden laadusta ja asennuksen laadusta. Kupariputkille mainitaan usein noin 40–50 vuoden käyttöikä, mutta yksittäinen putkisto voi kestää selvästi lyhyemmän tai pidemmän ajan. Kuntotutkimus kertoo todellisen tilanteen.",
      },
    ],
    related: ["putkiremontit", "putkistojen-huolto", "vesivuodon-korjaus"],
  },
  {
    slug: "putkiremontit",
    name: "Putkiremontit Helsingissä",
    shortName: "Putkiremontit",
    icon: "renovation",
    href: "/putkipalvelut/putkiremontit",
    metaTitle: "Putkiremontti Helsingissä – vaiheet, vastuut ja tarjoukset",
    metaDescription:
      "Mitä putkiremontti tarkoittaa omakotitalossa ja taloyhtiössä? Lue remontin vaiheista, vastuista, tarjousten vertailusta ja kotitalousvähennyksestä.",
    cardText: "Linjasaneeraus, kylpyhuoneen putkityöt ja laajemmat muutokset.",
    intro:
      "Putkiremontti eli linjasaneeraus on taloyhtiön tai omakotitalon suurimpia kunnossapitohankkeita. Siinä uusitaan tyypillisesti vesi- ja viemäriputket ja usein samalla märkätilat. Hyvä valmistelu ja vertailukelpoiset tarjoukset ratkaisevat paljon.",
    sections: [
      {
        heading: "Remontin vaiheet",
        list: [
          "kuntotutkimus ja hankesuunnittelu",
          "toteutussuunnittelu ja menetelmän valinta",
          "urakkatarjousten pyytäminen ja vertailu",
          "toteutus ja valvonta",
          "vastaanotto, takuuaika ja dokumentointi",
        ],
      },
      {
        heading: "Taloyhtiön putkiremontti",
        paragraphs: [
          "Taloyhtiössä putkiremontista päätetään yhtiökokouksessa, ja remontille on yleensä valittava ulkopuolinen valvoja. Osakas voi tilata omalla kustannuksellaan lisä- tai muutostöitä, kuten laadukkaampia pintamateriaaleja, mutta niistä on sovittava taloyhtiön kanssa.",
          "Osakkaana saat parhaan käsityksen kustannuksista ja aikataulusta tutustumalla hankesuunnitelmaan ja osallistumalla tiedotustilaisuuksiin.",
        ],
      },
      {
        heading: "Pienemmät putkityöt remontin yhteydessä",
        paragraphs: [
          "Kylpyhuone- tai keittiöremontin yhteydessä tehdään usein myös putkitöitä, kuten kalusteiden siirtoja ja lattiakaivon uusimista. Märkätilatöissä vedeneristyksen tekee usein eri ammattilainen kuin putkityöt, joten varmista, kuka vastaa mistäkin vaiheesta.",
        ],
      },
    ],
    priceFactors: [
      "remontin laajuus ja käytettävä menetelmä",
      "märkätilojen uusiminen samalla",
      "suunnittelu ja valvonta",
      "osakkaan omat lisätyöt",
    ],
    beforeOrdering: [
      "Pyydä tarjoukset samoista suunnitelmista, jotta voit verrata niitä.",
      "Tarkista urakoitsijan tiedot esimerkiksi YTJ:stä ja tilaajavastuulain mukaiset selvitykset suurissa urakoissa.",
      "Sovi maksuerät työn etenemisen mukaan – älä maksa suurta osaa etukäteen.",
    ],
    faq: [
      {
        q: "Saako putkiremontista kotitalousvähennystä?",
        a: "Omakotitalon remontin työn osuudesta voi saada kotitalousvähennystä. Taloyhtiön remontissa vähennystä ei yleensä saa yhtiövastikkeena maksetusta osuudesta, mutta osakkaan omasta tilaamasta asunnon sisäisestä työstä voi saada. Tarkista ajantasaiset ehdot Verohallinnon sivuilta.",
      },
    ],
    related: ["kayttovesiputkien-uusiminen", "putkistojen-huolto", "viemarin-avaus"],
  },
  {
    slug: "paivystava-putkimies",
    name: "Päivystävä putkimies Helsingissä",
    shortName: "Päivystävä putkimies",
    icon: "emergency",
    href: "/paivystava-putkimies",
    metaTitle: "Päivystävä putkimies Helsinki – päivystyksen hinnat ja ohjeet",
    metaDescription:
      "Putkimies päivystys Helsinki: vertaile julkaistuja ilta-, viikonloppu- ja pyhähintoja ja lue, milloin päivystys on tarpeen ja miten toimit vuodon sattuessa.",
    cardText: "Akuutit vuodot ja tukokset iltaisin, öisin ja viikonloppuisin.",
    intro:
      "Kun vesi ei mene poikki tai viemäri tulvii, apua tarvitaan heti. Päivystyskäynti on kuitenkin selvästi arkipäivän tuntityötä kalliimpi, joten kannattaa tietää, milloin päivystys on tarpeen ja miten hinnat muodostuvat.",
    sections: [
      {
        heading: "Milloin päivystys on tarpeen",
        list: [
          "vettä ei saa suljettua ja vuoto jatkuu",
          "vuoto uhkaa naapuriasuntoja, sähkölaitteita tai rakenteita",
          "viemäri tulvii eikä sitä voi jättää käyttämättä",
          "talossa ei ole vettä lainkaan, eikä kyse ole vesilaitoksen katkosta",
        ],
        paragraphs: [
          "Jos vesi saadaan poikki eikä vahinko etene, korjaus voi usein odottaa arkipäivään, jolloin tuntihinta on edullisempi. Kerrostalossa soita ensin taloyhtiön huoltoyhtiön päivystykseen – sen numero löytyy yleensä porraskäytävän ilmoitustaululta.",
        ],
      },
      {
        heading: "Näin päivystyshinnat muodostuvat",
        paragraphs: [
          "Putkiliikkeet hinnoittelevat päivystyksen eri tavoin. Osa veloittaa korotettua tuntihintaa, osa kiinteän päivystysmaksun, joka sisältää tietyn määrän työtunteja, ja sen jälkeen tuntihinnan. Lisäksi voidaan veloittaa lähtömaksu, kilometrikorvaus ja tarvikkeet. Kun pyydät hinta-arviota puhelimessa, kysy aina, mitä päivystysmaksuun sisältyy.",
        ],
      },
    ],
    priceFactors: [
      "kellonaika ja viikonpäivä – arki-ilta, viikonloppu ja arkipyhä hinnoitellaan eri tavoin",
      "kiinteä päivystysmaksu tai korotettu tuntihinta",
      "lähtömaksu ja kilometrikorvaus",
      "tarvikkeet ja erikoislaitteet",
    ],
    beforeOrdering: [
      "Sulje vesi ennen soittoa – se voi säästää sekä vahingoilta että päivystysmaksulta.",
      "Kysy puhelimessa hinta, mitä se sisältää ja milloin asentaja on paikalla.",
      "Kerrostalossa varmista huoltoyhtiöltä, kuka korjauksen tilaa ja maksaa.",
    ],
    faq: [
      {
        q: "Paljonko päivystävä putkimies maksaa Helsingissä?",
        a: "Vertailussamme mukana olevien yritysten julkaisemat päivystyshinnat ovat arki-iltaisin, viikonloppuisin ja pyhinä selvästi arkipäivän tuntihintoja korkeammat. Ajantasaiset luvut ja hintojen tarkistuspäivät näet hintavertailusta ja laskurista.",
      },
      {
        q: "Tuleeko päivystävä putkimies heti?",
        a: "Saapumisaika riippuu yrityksen tilanteesta ja kellonajasta. Kysy arvioitu saapumisaika puhelimessa ennen kuin sovit käynnistä.",
      },
    ],
    related: ["vesivuodon-korjaus", "viemarin-avaus", "putkistojen-huolto"],
  },
];

export const serviceBySlug = (slug: string): Service | undefined =>
  services.find((s) => s.slug === slug);

/** Palvelut, jotka ovat /putkipalvelut/[slug] -reitin alla (päivystys on juuritasolla). */
export const nestedServices = services.filter((s) => s.slug !== "paivystava-putkimies");
