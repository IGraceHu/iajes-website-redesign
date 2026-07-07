export const ROLENAMES = new Map([
  ["member", "Member"],
  ["admin-super", "Superadmin"],
  ["admin-region-jheasa", "Regional Representative (JHEASA)"],
  ["admin-region-ajcu-na", "Regional Representative (AJCU-NA)"],
  ["admin-region-ausjal", "Regional Representative (AUSJAL)"],
  ["admin-region-kircher", "Regional Representative (KIRCHER)"],
  ["admin-region-ajcu-ap", "Regional Representative (AJCU-AP)"],
  ["admin-region-ajcu-am", "Regional Representative (AJCU-AM)"],
  ["admin-tf-rac", "TF Admin (Research & Academic Cooperation)"],
  ["admin-tf-wis", "TF Admin (Women in STEM)"],
  ["admin-tf-hea", "TF Admin (Health)"],
  ["admin-tf-aih", "TF Admin (Artificial Intelligence & Humanity)"],
  ["admin-tf-esj", "TF Admin (Engineering & Social Justice)"],
  ["admin-tf-htfi", "TF Admin (Humanitarian Tech & Frugal Innovation)"],
  ["admin-tf-infr", "TF Admin (Infrastructure)"],
  ["admin-tf-ene", "TF Admin (Energy)"],
  ["admin-newsletter", "Newsletter Admin"],
  ["admin-resources", "Resources Admin"],
  ["admin-university", "University Representative"]
]);

export const ENGINEERINGDATA = new Map([
  ['Aerospace Engineering', ['Aerodynamics', 'Space Systems', 'Aircraft Structures', 'Propulsion Systems', 'Autonomous Flight'] ],
  ['Artificial Intelligence Engineering', ['Machine Learning', 'Generative AI', 'Computer Vision', 'Natural Language Processing', 'Responsible AI'] ],
  ['Automotive Engineering', ['Electric Vehicles', 'Autonomous Driving', 'Vehicle Dynamics', 'Powertrain Systems', 'Connected Mobility'] ],
  ['Biomedical Engineering', ['Medical Devices', 'Biomedical Imaging', 'Biomaterials', 'Rehabilitation Engineering', 'Digital Health'] ],
  ['Bioengineering', ['Synthetic Biology', 'Tissue Engineering', 'Bioprocess Engineering', 'Biosensors', 'Genetic Engineering'] ],
  ['Chemical Engineering', ['Process Design', 'Catalysis', 'Reaction Engineering', 'Sustainable Manufacturing', 'Separation Processes'] ],
  ['Civil Engineering', ['Smart Infrastructure', 'Geotechnical Engineering', 'Water Resources', 'Structural Design', 'Urban Development'] ],
  ['Computer Engineering', ['Embedded Systems', 'Computer Architecture', 'IoT Systems', 'Edge Computing', 'Hardware-Software Co-Design'] ],
  ['Computer Science & Engineering', ['Algorithms', 'Distributed Systems', 'Artificial Intelligence', 'Human-Computer Interaction', 'Cloud Computing'] ],
  ['Construction Engineering', ['Construction Management', 'Building Information Modeling (BIM)', 'Sustainable Construction', 'Project Planning', 'Construction Automation'] ],
  ['Cybersecurity Engineering', ['Network Security', 'Cryptography', 'Secure Software', 'Digital Forensics', 'Cyber-Physical Systems Security'] ],
  ['Data Engineering', ['Big Data Systems', 'Data Pipelines', 'Data Governance', 'Data Warehousing', 'Real-Time Analytics'] ],
  ['Electrical Engineering', ['Power Systems', 'Signal Processing', 'Renewable Energy Systems', 'Electronics', 'Smart Grids'] ],
  ['Electronic Engineering', ['Analog & Digital Circuits', 'Microelectronics', 'Embedded Electronics', 'Semiconductor Devices', 'Sensor Systems'] ],
  ['Energy Engineering', ['Renewable Energy', 'Energy Storage', 'Smart Grids', 'Hydrogen Technologies', 'Energy Efficiency'] ],
  ['Environmental Engineering', ['Water Treatment', 'Air Quality', 'Climate Adaptation', 'Waste Management', 'Environmental Monitoring'] ],
  ['Industrial Engineering', ['Operations Research', 'Supply Chain Management', 'Process Optimization', 'Human Factors', 'Quality Engineering'] ],
  ['Information Engineering', ['Information Systems', 'Data Analytics', 'Knowledge Management', 'Decision Support Systems', 'Information Security'] ],
  ['Information Technology', ['Cloud Computing', 'IT Infrastructure', 'Enterprise Systems', 'Network Administration', 'Digital Transformation'] ],
  ['Materials Engineering', ['Advanced Materials', 'Nanomaterials', 'Polymers', 'Composite Materials', 'Materials Characterization'] ],
  ['Mechanical Engineering', ['Advanced Manufacturing', 'Thermofluids', 'Robotics', 'Machine Design', 'Computational Mechanics'] ],
  ['Mechatronics Engineering', ['Intelligent Automation', 'Control Systems', 'Embedded Systems', 'Robotics', 'Smart Manufacturing'] ],
  ['Mining Engineering', ['Mineral Processing', 'Mine Automation', 'Rock Mechanics', 'Sustainable Mining', 'Resource Exploration'] ],
  ['Petroleum Engineering', ['Reservoir Engineering', 'Drilling Technologies', 'Enhanced Oil Recovery', 'Carbon Storage', 'Energy Transition'] ],
  ['Robotics Engineering', ['Autonomous Robots', 'Robot Perception', 'Human-Robot Interaction', 'Swarm Robotics', 'Robotic Manipulation'] ],
  ['Software Engineering', ['Software Architecture', 'DevOps', 'Software Testing', 'Agile Development', 'Software Quality Assurance'] ],
  ['Structural Engineering', ['Earthquake Engineering', 'Structural Health Monitoring', 'Advanced Materials', 'Bridge Engineering', 'Resilient Infrastructure'] ],
  ['Systems Engineering', ['Systems Modeling', 'Complex Systems', 'Digital Twins', 'Systems Integration', 'Decision Analysis'] ],
  ['Telecommunications Engineering', ['Wireless Communications', '5G/6G Networks', 'Optical Communications', 'Network Security', 'Internet of Things (IoT)'] ],
  ['Transportation Engineering', ['Intelligent Transportation Systems', 'Traffic Engineering', 'Sustainable Mobility', 'Transportation Planning', 'Autonomous Transportation'] ],
  ['Other', [] ]
]);

export const COUNTRYDATA = ['Afghanistan', 'Albania', 'Algeria', 'American Samoa', 'Andorra', 'Angola', 'Anguilla', 'Antigua and Barbuda', 'Argentina', 'Armenia', 'Aruba', 'Australia', 'Austria', 'Azerbaijan', 'The Bahamas', 'Bahrain', 'Bangladesh', 'Barbados', 'Belarus', 'Belgium', 'Belize', 'Benin', 'Bermuda', 'Bhutan', 'Bolivia', 'Bosnia and Herzegovina', 'Botswana', 'Brazil', 'British Virgin Islands', 'Brunei', 'Bulgaria', 'Burkina Faso', 'Burundi', 'Cabo Verde (Cape Verde)', 'Cambodia', 'Cameroon', 'Canada', 'Cayman Islands', 'Central African Republic', 'Chad', 'Chile', 'China', 'Cocos (Keeling) Islands', 'Colombia', 'Comoros', 'Democratic Republic of the Congo', 'Republic of the Congo', 'Cook Islands', 'Costa Rica', 'Côte d’Ivoire', 'Croatia', 'Cuba', 'Curaçao', 'Cyprus', 'Czech Republic', 'Denmark', 'Djibouti', 'Dominica', 'Dominican Republic', 'East Timor (Timor-Leste)', 'Ecuador', 'Egypt', 'El Salvador', 'Equatorial Guinea', 'Eritrea', 'Estonia', 'Eswatini (Swaziland)', 'Ethiopia', 'Falkland Islands', 'Faroe Islands', 'Fiji', 'Finland', 'France', 'French Guiana', 'French Polynesia', 'Gabon', 'The Gambia', 'Gaza Strip', 'Georgia', 'Germany', 'Ghana', 'Gibraltar', 'Greece', 'Greenland', 'Grenada', 'Guadeloupe', 'Guam', 'Guatemala', 'Guernsey', 'Guinea', 'Guinea-Bissau', 'Guyana', 'Haiti', 'Honduras', 'Hong Kong', 'Hungary', 'Iceland', 'India', 'Indonesia', 'Iran', 'Iraq', 'Ireland', 'Isle of Man', 'Israel', 'Italy', 'Jamaica', 'Japan', 'Jersey', 'Jordan', 'Kazakhstan', 'Kenya', 'Kiribati', 'North Korea', 'South Korea', 'Kosovo', 'Kuwait', 'Kyrgyzstan', 'Laos', 'Latvia', 'Lebanon', 'Lesotho', 'Liberia', 'Libya', 'Liechtenstein', 'Lithuania', 'Luxembourg', 'Macau', 'Madagascar', 'Malawi', 'Malaysia', 'Maldives', 'Mali', 'Malta', 'Marshall Islands', 'Martinique', 'Mauritania', 'Mauritius', 'Mayotte', 'Mexico', 'Micronesia', 'Moldova', 'Monaco', 'Mongolia', 'Montenegro', 'Montserrat', 'Morocco', 'Mozambique', 'Myanmar (Burma)', 'Namibia', 'Nauru', 'Nepal', 'Netherlands', 'New Caledonia', 'New Zealand', 'Nicaragua', 'Niger', 'Nigeria', 'Niue', 'North Macedonia', 'Northern Mariana Islands', 'Norway', 'Oman', 'Pakistan', 'Palau', 'Panama', 'Papua New Guinea', 'Paraguay', 'Peru', 'Philippines', 'Pitcairn Island', 'Poland', 'Portugal', 'Puerto Rico', 'Qatar', 'Réunion', 'Romania', 'Russia', 'Rwanda', 'Saint Helena', 'Saint Kitts and Nevis', 'Saint Lucia', 'Saint-Pierre and Miquelon', 'Saint Vincent and the Grenadines', 'Samoa', 'San Marino', 'Sao Tome and Principe', 'Saudi Arabia', 'Senegal', 'Serbia', 'Seychelles', 'Sierra Leone', 'Singapore', 'Sint Maarten', 'Slovakia', 'Slovenia', 'Solomon Islands', 'Somalia', 'South Africa', 'Spain', 'Sri Lanka', 'South Sudan', 'Sudan', 'Suriname', 'Sweden', 'Switzerland', 'Syria', 'Taiwan', 'Tajikistan', 'Tanzania', 'Thailand', 'Togo', 'Tokelau', 'Tonga', 'Trinidad and Tobago', 'Tunisia', 'Turkey', 'Turkmenistan', 'Tuvalu', 'Turks and Caicos Islands', 'Uganda', 'Ukraine', 'United Arab Emirates', 'United Kingdom', 'United States', 'United States Virgin Islands', 'Uruguay', 'Uzbekistan', 'Vanuatu', 'Vatican City', 'Venezuela', 'Vietnam', 'Wallis and Futuna', 'West Bank', 'Western Sahara', 'Yemen', 'Zambia', 'Zimbabwe'];

export const LANGUAGEDATA = ['Afrikaans', 'Albanian', 'Amharic', 'Arabic', 'Armenian (Eastern)', 'Armenian (Western)', 'Azerbaijani (Azeri)', 'Bassa', 'Belarusian', 'Bengali', 'Bosnian', 'Braille', 'Bulgarian', 'Burmese', 'Cambodian (Khmer)', 'Cape Verde Creole', 'Cebuano', 'Chinese (Simplified)', 'Chinese (Traditional)', 'Chuukese', 'Croatian', 'Czech', 'Danish', 'Dari', 'Dutch', 'English', 'Estonian', 'Farsi (Persian)', 'Finnish', 'Flemmish', 'French (Canada)', 'French (France)', 'Fulani', 'Georgian', 'German', 'Greek', 'Gujarati', 'Haitian Creole', 'Hakha Chin', 'Hakka (Chinese)', 'Hebrew', 'Hindi', 'Hmong', 'Hungarian', 'Icelandic', 'Igbo/Ibo', 'Ilocano', 'Ilonggo (Hiligaynon)', 'Indonesian', 'Italian', 'Japanese', 'Javanese', 'Kannada', 'Karen', 'Kazakh', 'Kinyarwanda', 'Kirundi', 'Korean', 'Kurdish (Kurmanji dialect)', 'Kurdish (Sorani dialect)', 'Kyrgyz/Kirgiz', 'Lao (Laotian)', 'Latvian', 'Lithuanian', 'Macedonian', 'Malay (Malaysian)', 'Mandinka', 'Marathi', 'Marshallese', 'Mien', 'Mongolian', 'Montenegrin', 'Navajo', 'Nepali', 'Norwegian', 'Oromo', 'Pashto', 'Polish', 'Portuguese (Brazil)', 'Portuguese (Portugal)', 'Punjabi', 'Rohingya', 'Romanian (Moldavan)', 'Russian', 'Serbian', 'Slovak', 'Slovenian', 'Somali', 'Spanish (Castilian)', 'Spanish (Latin American)', 'Spanish (other varieties)', 'Swahili', 'Swedish', 'Tagalog', 'Tamil', 'Telugu', 'Thai', 'Tibetan', 'Tigrinya', 'Turkish', 'Ukrainian', 'Urdu', 'Uzbek', 'Vietnamese', 'Wolof', 'Yoruba'];
