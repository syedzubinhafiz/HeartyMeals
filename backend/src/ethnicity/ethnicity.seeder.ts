import { Connection } from "typeorm";
import { Ethnicity } from "./ethnicity.entity";

const ETHNICITY_LIST = [
    'Aeta',
    'Afro-Brazilian',
    'Afro-Caribbean',
    'Ainu',
    'Akha',
    'Albanian',
    'Amhara',
    'Arawak',
    'Arab',
    'Armenian',
    'Assyrian',
    'Aymara',
    'Azerbaijani',
    'Baloch',
    'Bamar',
    'Bantu',
    'Basque',
    'Batak',
    'Belarusian',
    'Bengali',
    'Berber',
    'Bhutanese',
    'Bidayuh',
    'Bikolano',
    'Bihari',
    'Black American',
    'Boer',
    'Brahmin',
    'Breton',
    'Burmese',
    'Bulgarian',
    'Burgher',
    'Cebuano',
    'Cham',
    'Chamorro',
    'Cherokee',
    'Chewa',
    'Chhetri',
    'Chinese',
    'Chinese Indonesian',
    'Chinese Korean',
    'Chin',
    'Chuvash',
    'Cossack',
    'Croatian',
    'Cuban',
    'Dane',
    'Dayak',
    'Dutch',
    'Egyptian',
    'English',
    'Eritrean',
    'Estonian',
    'Fijian',
    'Finn',
    'French',
    'Garifuna',
    'Garo',
    'Georgian',
    'German',
    'Ghanaian',
    'Greek',
    'Guarani',
    'Gujrati',
    'Gurung',
    'Haitian',
    'Han',
    'Hausa',
    'Hazara',
    'Hmong',
    'Hopi',
    'Hungarian',
    'Hui',
    'Iban',
    'Igbo',
    'Ilocano',
    'Indian',
    'Indo-Aryan',
    'Inuit',
    'Irish',
    'Isan',
    'Italian',
    'Japanese',
    'Javanese',
    'Jewish',
    'Jin',
    'Jola',
    'Jordanian',
    'Kalash',
    'Karen',
    'Kashmiri',
    'Kazakh',
    'Kenyang',
    'Khan',
    'Khmer',
    'Khoisan',
    'Kinh',
    'Korean',
    'Kosovar',
    'Kurd',
    'Ladino',
    'Latvian',
    'Lithuanian',
    'Lur',
    'Macedonian',
    'Maithil',
    'Malagasy',
    'Malay',
    'Malayali',
    'Maltese',
    'Manchu',
    'Maori',
    'Marathi',
    'Maya',
    'Melanau',
    'Mexican',
    'Miao',
    'Minangkabau',
    'Miskito',
    'Mongol',
    'Mon',
    'Moroccan',
    'Moro',
    'Muhajir',
    'Munda',
    'Muslim',
    'Nepali',
    'Newar',
    'Nigerian',
    'Norwegian',
    'Nuer',
    'Nung',
    'Nyanja',
    'Oromo',
    'Ossetian',
    'Palestinian',
    'Pashtun',
    'Persian',
    'Polish',
    'Portuguese',
    'Punjabi',
    'Quechua',
    'Roma',
    'Romanian',
    'Rohingya',
    'Russian',
    'Ryukyuan',
    'Sami',
    'Samoan',
    'San',
    'Saraiki',
    'Santhal',
    'Sardinian',
    'Scottish',
    'Serbian',
    'Sherpa',
    'Shona',
    'Sikh',
    'Sinhalese',
    'Slovak',
    'Slovenian',
    'Somali',
    'Spanish',
    'Sudanese',
    'Sundanese',
    'Swazi',
    'Swedish',
    'Swiss',
    'Tagalog',
    'Taiwanese',
    'Tamil',
    'Tatar',
    'Tay',
    'Thai',
    'Tibetan',
    'Tlingit',
    'Tongan',
    'Tshokwe',
    'Tunisian',
    'Turk',
    'Turkmen',
    'Tutsi',
    'Tuvan',
    'Uighur',
    'Ukrainian',
    'Uzbek',
    'Venda',
    'Vietnamese',
    'Visayan',
    'Wa',
    'Wolof',
    'Xhosa',
    'Yoruba',
    'Yupik',
    'Zulu'
];


async function seedEthnicity(connection: Connection) {
    const ethnicityRepo = connection.getRepository(Ethnicity);

    // Do not add ethnicity if they already exist
    const existingEthnicity = await ethnicityRepo.find();
    const existingEthnicityNames = new Set(existingEthnicity.map(ethnicity => ethnicity.name));

    // Exclude existing ethnicities
    const filteredEthnicity = ETHNICITY_LIST.filter(ethnicity => !existingEthnicityNames.has(ethnicity));

    if (filteredEthnicity.length > 0) {
        // Add new ethnicities
        const ethnicityEntities = filteredEthnicity.map(name => ({ name }));
        await ethnicityRepo.save(ethnicityEntities);
        console.log(`${filteredEthnicity.length} new ethnicities have been seeded.`);
    } else {
        console.log('No new ethnicity to seed.');
    }
}


export default seedEthnicity;
