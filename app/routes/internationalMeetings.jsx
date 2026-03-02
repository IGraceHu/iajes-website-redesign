import { useEffect, useState } from "react";
import { Menu } from "../components/menu";

export function meta() {
  return [{ title: "International Meetings" }];
}

const MILESTONE_2024 = [
  "Jesuit Engineering Perspective for an Improved Global Future",
  "The gathering in Bhubaneswar will mark a significant moment in shaping the future trajectory of our network",
  "Delve deeper into the essence, purpose, and approach of our Network",
  "This pivotal gathering in XIM University is dedicated to the profound exploration and refinement of the IAJES identity, vision, organizational structure, priorities, and collaborative methodologies within the expansive network. At the forefront of our discussions lies a conscientious consideration of the pressing global \"emergency\" confronting the world. Searching into the realm of integral ecology, we aim to foster a shared understanding among IAJES members regarding a common goal.",
  "Within the esteemed halls of XIM University, a dynamic discourse is set to unfold, resonating with the shared aspirations that have been articulated through the powerful lens of the 4 Universal Apostolic Preferences.",
  "Employ engineering expertise to enhance the efficiency and foster the growth of our network",
  "At the heart of our concerted efforts lie the main drivers for transformative action our task forces and projects. As we come together at this event, the joy of collective gathering is amplified by the synergistic blend of our diverse expertise and shared determination.",
  "Over the course of the three days that encapsulate our summit, a triad of thematic dimensions Inspiration, Reflection, and Action will guide our deliberations.",
  "IAJES's next two years",
  "A pivotal goal on the horizon is the election of the IAJES Board for the forthcoming years, a critical decision that will shape the course of our organization.",
  "Equally significant is the determination of effective strategies for overseeing and coordinating the various task forces and projects, aligning them seamlessly with the identified plan of action. Delving deeper into our organizational framework, we aim to articulate a clear roadmap, ensuring that our trajectory remains harmoniously synchronized with the overarching goals of the International Association of Jesuit Universities (IAJU).",
  "This strategic session is poised to be a cornerstone in fortifying the structure and purpose of IAJES, laying the foundation for a dynamic and purposeful journey ahead.",
];

const PROGRAM_2024 = [
  "This program reflects our hope that everyone will make the most of the three days we spend together",
  "Program details",
  "More information on the IAJES Bhubaneswar Summit website",
];

const PROGRAM_SCHEDULE_2024 = [
  {
    day: "Tuesday July 9, 2024",
    items: [
      "Guest Arrival and Check-in at XIM University",
    ],
  },
  {
    day: "Wednesday July 10, 2024",
    theme: "Inspiration",
    items: [
      "Meeting of the IAJES GB and OC (for executive members) to finalize the Summit organization. And in parallel Registration (for other members) (Election of the Executive Committee)",
      { title: "Coffee break", tone: "break" },
      "Opening by XIM University, Vice Chancellor (Fr. Antony R Uvari, S.J.), IAJES President (Rosa Nomen) & IAJU Secretary (J. Christie, S.J.)",
      "IAJES information - Presentation of the organization with the Region Representatives",
      { title: "Catered Lunch", tone: "break" },
      "IAJES information - Presentation of the organization with the Region Representatives",
      "Presentation of XIM University by Registrar (Fr. S.Antony Raj, S.J.) followed by XIM University Campus Tour",
      "Poster Session representing the participating regions and the Task Force outcomes (including social conversations and networking)",
      { title: "Cultural programme & Dinner", tone: "break" },
    ],
  },
  {
    day: "Thursday July 11, 2024",
    theme: "Reflection",
    items: [
      "Connecting the dots / Mediation (XX)",
      "Collaborative Working Session 1 - 6 regions implementation, The importance of networking (Each region in a separate room)",
      { title: "Coffee break", tone: "break" },
      {
        title: "Highlighting projects",
        subitems: [
          "Mentoring & PHD",
          "Infrastructure",
          "Low Tech",
          "Energy",
          "Student challenge",
        ],
      },
      { title: "Catered Lunch", tone: "break" },
      { title: "Break", tone: "break" },
      {
        title: "Highlighting projects",
        subitems: [
          "Women Group initiative",
          "Social justice",
          "Health Care",
        ],
      },
      {
        title: "Unconference format with option for Walk outside",
        subitems: ["Networking"],
      },
      "Election of the Governing Board",
      { title: "Dinner", tone: "break" },
    ],
  },
  {
    day: "Friday July 12, 2024",
    theme: "Action",
    items: [
      "Connecting the dots / Mediation (XX)",
      "Collaborative Working Session 2 - Action. Exploring opportunities and experiences with the Task Forces and Projects (In Breakout Rooms)",
      { title: "Coffee break", tone: "break" },
      "IAJES's future development - Presentation commitments for the next 2 years by the regional representatives and the Task Force leaders",
      "Closing Meeting (J. Christie SJ and XIM Rector)",
      { title: "Lunch + Conversations", tone: "break" },
      { title: "Break", tone: "break" },
      "Meeting of the new IAJES Boards",
    ],
  },
];

const PROGRAM_SCHEDULE_2022 = [
  {
    day: "Tuesday July 12",
    items: [
      "Guest Arrival and Check-in with BC contact",
    ],
  },
  {
    day: "Wednesday July 13",
    theme: "Inspiration",
    items: [
      "Meeting of the IAJES Board (for executive members) and in parallel Registration (for other members)",
      { title: "Coffee break", tone: "break" },
      "Opening by BC rector (G. Kalscheur SJ) & IAJES president (O. de Bourblanc)",
      "IAJES information - Presentation of the organization + Presentation of the task forces by the leaders",
      { title: "Catered Lunch", tone: "break" },
      "Interactive Participatory Session: Re-imagining the Jesuit Engineering Vision for a Better World (G. Gaudette, J. Kozarich)",
      "Boston College Tour + Poster Session representing the participating universities and the task force outcomes (including social conversations and networking)",
      "Unconferencing: Connections and Networking",
      { title: "Dinner & Culture + Speaker", tone: "break" },
    ],
  },
  {
    day: "Thursday July 14",
    theme: "Reflection",
    items: [
      "Reflection Session 1 - Connecting the dots (J. Keenan SJ)",
      "Collaborative Working Session 1 - Building upon day one's forward thinking vision in alignment with the IAJES Task Forces",
      { title: "Coffee break", tone: "break" },
      "Mentoring and the Jesuit Ethos - Initiating an IAJES program to catalyze increased global collaborations for the common good (R. Nomen)",
      { title: "Catered Lunch + Speaker - Planet centered design for global impact (G. Yadama + A. Salifou)", tone: "break" },
      "The futur is here: Next generation of engineers (D. Sengeh)",
      "Unconference format with option for Waterworks museum - Working session findings (Poster board walk around)",
      "Election of the Board",
      { title: "Dinner & Culture + Speaker Human centered engineering: The surgery box (M. Teodorescu)", tone: "break" },
    ],
  },
  {
    day: "Friday July 15",
    theme: "Action",
    items: [
      "Reflection Session 2 - Connecting the dots (J. Keenan SJ)",
      "Collaborative Working Session 2 - Action - Exploring global opportunities and experiences",
      { title: "Coffee break", tone: "break" },
      "IAJES's future development - How all can we position IAJES as a leading organization in its field ? How can we get people involved in a more concrete way ?",
      "Closing Meeting (J. Christie SJ)",
      { title: "Lunch + Conversations", tone: "break" },
      "Unconferencing: Connections and Networking",
      "Meeting of the new IAJES Board",
    ],
  },
];

const MILESTONE_2022 = [
  "The summit in Boston represented a milestone event for the future of our network",
  "Explore further the identity, mission, and strategy of our Network",
  "The primary objective of this meeting in Boston was to further the IAJES identity, vision, organizational structure, priorities, and ways of working within our network. In particular, with regard to the \"emergency\" the world is currently facing, what can we reasonably expect from IAJES members as a common goal in terms of integral ecology? How far and how fast can we progress and work together within IAJES and to have a positive impact on the future society?",
  "In Boston, we discussed our common ambition in response to the fervent calls signified through the 4 Universal Apostolic Preferences.",
  "Apply the \"engineering touch\" and make our network grow in efficiency",
  "The main levers for action are the task forces and projects. Beyond the joy of gathering at this event, thanks to the synergy of our expertise and common determination, our network is called to address new challenges and projects in the context of the near future.",
  "The 3 days of our summit w as articulated around 3 axes: Inspiration-Reflection-Action. Our goal was to leave these 3 days with concrete and achievable projects to develop in order to strengthen the relationship between our universities in line with Ignatius' thinking",
  "Plan ahead for the next 2 years of IAJES",
  "An important objective was to elect the IAJES Boards and Committees for the coming years, as well as to decide on the means to manage and coordinate the task forces and projects in line with the identified plan of action. We also begin to define our roadmap that will allow us to be in line with the International Association of Jesuit Universities (IAJU).",
  "In that way, a new Executive Board constituted by the President, the Vice-president and the Secretary will work closely together to consolidate the work initiated by the former teams and find the right balance, between events, projects, and actions, for the future development of IAJES. Moreover, one of its first tasks is to write the road map that establishes the visibility inside and outside the IAJES, the relationship with IAJU and ensures the continuity of the Association.",
  "A Governing Board, formed by the IAJU Region Representatives and the Executive Board, will work to guarantee the link with IAJU, to facilitate the participation of all Engineering Schools in all regions, to validate and ensure the correct positioning of all the task forces and projects.",
  "An Operational Committee, formed by all the Task Force and Project Leaders and the Executive Board, will follow the progress of the task forces and projects and could propose the closing of an action or the opening of a new one.",
  "The Task Force and Project Leaders will lead the different working groups. They will decide on its organization and the necessary means, in particular the rhythm of the team meetings which guarantees the progress of the actions.",
];

const PROGRAM_2022 = [
  "This program reflect ed the hope that everyone c ould make the most of the three days we spent together",
  "Program details",
  "The main conclusion at the end of the Summit was to confirm that IAJES is a young family happy to meet face-to-face and enthusiastic about the future we have to deal with. In addition, we discovered a huge amount of work still to be done as most of the youngest group.",
  "Let us summarize a bit what happened those days, from 13 to 15 of July 2022 after the excellent organization given by the Boston College team with whom we have worked regularly over the past months.",
  "The first day, Inspiration , was for remembering and knowing the progress done during the past three years, by the Executive Committee and the Tasks Force and Projects leaders. In that aspect, the rules of the Association were approved in which the vision, mission and ambition are declared as well as the objectives. A new organigram was designed with the aim to have more visibility inside our engineering schools and to engage as many faculties as possible in IAJES.",
  "The second and the third days had a similar structure combining inspirational conferences and working sessions for knowing, thinking, and sharing communitarian and personal thoughts that would help the growth of the association for a better service to the Engineering community and the world. Nevertheless, the second day was devoted to Reflection and the third to Action . The 3 pillars, considering the first-day Inspiration, of the Ignatian spirituality.",
  "Let us remark on the initial sessions of those two days conducted by James (Jim) Keenan SJ, Vice Provost for Global Engagement of Boston College, for whom Engineering provides tools to build bridges of recognition. Something essential for initiating thinking about some need or necessity is to recognize that someone, some community, or something, needs our attention. Without recognition, communities are not considered. He also focused his speeches on vulnerability as the capacity to be responsive to others, but not as a disease, and highlights that the strongest voices talking on vulnerability are women because they have the capacity of recognition. Thank you, Jim.",
  "The session devoted to the Mentoring IAJES project, with 37 members working in pairs from quasi all the IAJU regions, allowed us to consider what mentoring means under the Ignatian sense. Something was clear, the controversy that this word raises, especially in English speakers' countries. Nevertheless, it was clear that for us mentoring is not giving advertisements and answers, it is an accompaniment for personal growth. In Ignatian words, for a better use of people, putting the question and not many as it is written in the Spiritual Exercises. In the end, we recognize a tool for working together.",
  "We had very inspirational invited speakers. Let us mention only one, David M. Sengeh, Biomedical Engineer at MIT, Sierra Leone's first chief innovation officer and youngest ever education minister. When he came back to Sierra Leone, he realizes that all work done at MIT was not useful in his country, there is nothing. He should begin from zero, looking for the population's needs and putting the accumulated knowledge at MIT at the service of their citizens.",
  "He urged us to work for social justice because it is not a nice word, it is necessary for a better world for learning for real sustainable development, for involving Engineering in policy, and for splitting education all around the world. Let us add two ideas from Fr. Keenan. First, don't do like most of the people that are interested in what our students are, do like those who are interested in what they are not, and try to convert them. Second, do not tell students what they should do, show them what we are doing, and they will understand.",
  "All of us thank the extraordinary work done by Prof. Sunand Bhattacharya, Prof. Glenn Gaudette and their teams, not only for the logistics but also for their professionalism and for choosing speakers and offering very nice ideas that help the summit to be a great success.",
  "Finally, in the closing session, Joseph Christie SJ encouraged all of us to work according to what happened those 3 days at Boston College, to split our experience among all our colleagues, and to work all together putting our engineering knowledge and common sense at the service of people for building a better common house. Prof. Rosa Nomen, the elected president, closes the event, saying that we, IAJES members, have the strength, energy, and desire to work together, but we need the support of our institutions by giving us time and recognition to let this network consolidate and grow.",
];

const MILESTONE_2019 = [
  "2nd IAJES Conference Cali July 2019",
  "July Wednesday 17th - Thursday 18th - Friday 19th, 2019",
  "Welcome in Javeriana Colombia",
  "From July 15th to the 19th, the IAJES conference took place over three days in Javeriana Cali with a two-day pre-conference in Javeriana Bogota.",
  "The conference gathered 50 participants representing 30 Jesuit Engineering colleges. This illustrates a good progression since the conference in Bilbao last year where 20 universities were represented.",
  "We enjoyed a wonderful welcome from our friends of Javeriana in Bogota and Cali.",
  "They shared both their projects and expertises with us and a contagious enthusiasm through colourful aspects of the Colombian culture.",
  "The first observation was the pleasure and communicative energy experienced by the participants through the contacts and the mutual knowledge.",
  "List of participants",
  "Sharing of numerous rich proposals and paths of collaboration",
  "The conference led us to reflect about policies and directions both for Academic and Research within IAJES. For example, we discussed models for collaborative PhD training with inter-university courses. The conference led to the emergence of clusters around essential engineering issues.",
  "Collaboration among Laboratories",
  "Public Health and Healthcare",
  "This large domain of research offers numerous opportunities of connections between the JES. The decision was made to create the IAJES health network. Artificial intelligence for Medicine, Biomedical instrumentation, Sustainable production of a biopolymer for nanoencapsulation.. . and also logistics for an efficient public health system...were some issues tackled during the conference.",
  "Energy",
  "Energy is another field where synergy among JES appears very promising. The speakers called for collaboration on Data Analytics for the Energy Sector, High Power converters for renewable energies, electric energy transportation, affordable solar energy systems for remote locations...",
  "Infrastructure",
  "It constitutes an important field of cooperation. From Cali to Madrid, how to invent sustainable and safe mobility and transport policies? Universities are located in countries exposed to seismic risks. How earthquakes be simulated and the dramatic consequences prevented?",
  "Water",
  "Access to safe water is a crucial issue for a large part of humanity. Climate change brings serious disturbances in the water cycle. Researchers of IAJES propose to share their field of expertise to design for example water quality controlling sensors, fight the contamination of water resources by pathogens and provide clean water in remote areas.",
  "Humanitarian Engineering and frugal innovation",
  "Humanitarian engineering and frugal innovation are connected. For low income populations, sustainable solutions to improve daily life have to be designed and implemented with the creativity of the local communities themselves. It implies a specific humanitarian project management and the use of all resources of frugal innovation: local materials, low cost and local hightech, circular economy including waste recovery, management, treatment and valorization.",
  "A decision was taken in Cali to create a global humanitarian engineering task force. It will aim to develop frugal Innovation in the curricula, social and technological exchange programs, promotion of collaborative projects (for example SUGAR Network - Cali).",
  "Another aspect of the frugal innovation aims to promote a desire for \"healthy sobriety\" (Laudato Si 126) within wealthy populations. The challenge is to change high consumption habits into resource efficient practices. For example the project FLW in Mexico gives solutions for the quantification and characterization of all the Food Loss and Waste.",
  "Engineering & Social justice",
  "A large number of JES are motivated to make progress on the following questions: How to improve social sensitivity and skills and promote committed engineers for greater social justice.",
  "The HOPE project guided by DEUSTO is an inspiring example. It aims to create a multi-stakeholder platform that focuses on the social sustainability of the electronic supply chain (from the extraction of raw materials to the smartphone).",
  "A IAJES task force wants to constitute a repository of learning situations crossing multiple domains through which students experiment interculturality, and equip themselves as engineers for social change.",
  "Science Engineering and Spirituality",
  "The first proposal around this topic is based on excellent courses \"Science and Religion\" already done in several universities in Asia, Latin America, and the US. The key principle is to use the relationship between science and religion as a platform for interreligious dialogue. A task force has been formed to pursue the work, enrich the training offer intended to students and faculty.",
  "Laudato Si and the ecological transition",
  "In resonance with the 4th Universal Apostolic Preference, the pedagogy \"Laudato Si\" is likely to give a greater amplitude to some fundamentals of Jesuit Engineering schools. For example: The necessary discernment of our actions and projects for the common good implies strengthening training in personal and collective discernment. Pastoral care will be receiving a revitalizing drive and becoming an invitation to a fourfold alliance: with oneself (personal ecology or daily life), with others and in particular with the poor (social ecology), with our common house and the creation (environmental and cultural ecology) and with the Creator.",
  "And \"Everything is linked\" [leitmotiv of \"Laudato Si\"]. Entrepreneurship (or intrapreneurship) is given a reinforced breath. Because it is a call to creativity and initiative that predominates in \"Laudato Si\" facing crucial issues for our future. And our engineers with an enlightened vision, a capacity for discernment and technical skills will be major actors of change.",
  "Incentive proposals are shared in Cali: Integration of the integral ecology in the academic programs, creation of summer programs specifically aimed at Integral ecology, Networked Data Devices to strengthen persuasive Eco-awareness.",
  "Multi-domains Proposals",
  "Our Colombian friends from Javeriana have set very high standards!",
  "Team of students serving the meeting with constant good mood and attention!",
  "Lot of thanks to the dream teams of Javeriana!",
];

const CALI_MILESTONE_SECTIONS = [
  {
    title: "Welcome in Javeriana Colombia",
    details: [
      "From July 15th to the 19th, the IAJES conference took place over three days in Javeriana Cali with a two-day pre-conference in Javeriana Bogota.",
      "The conference gathered 50 participants representing 30 Jesuit Engineering colleges. This illustrates a good progression since the conference in Bilbao last year where 20 universities were represented.",
      "We enjoyed a wonderful welcome from our friends of Javeriana in Bogota and Cali.",
      "They shared both their projects and expertises with us and a contagious enthusiasm through colourful aspects of the Colombian culture.",
      "The first observation was the pleasure and communicative energy experienced by the participants through the contacts and the mutual knowledge.",
    ],
  },
  {
    title: "Sharing of numerous rich proposals and paths of collaboration",
    details: [
      "The conference led us to reflect about policies and directions both for Academic and Research within IAJES. For example, we discussed models for collaborative PhD training with inter-university courses. The conference led to the emergence of clusters around essential engineering issues.",
    ],
    subsections: [
      {
        title: "Collaboration among Laboratories",
        details: [],
      },
      {
        title: "Public Health and Healthcare",
        details: [
          "This large domain of research offers numerous opportunities of connections between the JES. The decision was made to create the IAJES health network. Artificial intelligence for Medicine, Biomedical instrumentation, Sustainable production of a biopolymer for nanoencapsulation.. . and also logistics for an efficient public health system...were some issues tackled during the conference.",
        ],
      },
      {
        title: "Energy",
        details: [
          "Energy is another field where synergy among JES appears very promising. The speakers called for collaboration on Data Analytics for the Energy Sector, High Power converters for renewable energies, electric energy transportation, affordable solar energy systems for remote locations...",
        ],
      },
      {
        title: "Infrastructure",
        details: [
          "It constitutes an important field of cooperation. From Cali to Madrid, how to invent sustainable and safe mobility and transport policies? Universities are located in countries exposed to seismic risks. How earthquakes be simulated and the dramatic consequences prevented?",
        ],
      },
      {
        title: "Water",
        details: [
          "Access to safe water is a crucial issue for a large part of humanity. Climate change brings serious disturbances in the water cycle. Researchers of IAJES propose to share their field of expertise to design for example water quality controlling sensors, fight the contamination of water resources by pathogens and provide clean water in remote areas.",
        ],
      },
      {
        title: "Humanitarian Engineering and frugal innovation",
        details: [
          "Humanitarian engineering and frugal innovation are connected. For low income populations, sustainable solutions to improve daily life have to be designed and implemented with the creativity of the local communities themselves. It implies a specific humanitarian project management and the use of all resources of frugal innovation: local materials, low cost and local hightech, circular economy including waste recovery, management, treatment and valorization.",
          "A decision was taken in Cali to create a global humanitarian engineering task force. It will aim to develop frugal Innovation in the curricula, social and technological exchange programs, promotion of collaborative projects (for example SUGAR Network - Cali).",
          "Another aspect of the frugal innovation aims to promote a desire for \"healthy sobriety\" (Laudato Si 126) within wealthy populations. The challenge is to change high consumption habits into resource efficient practices. For example the project FLW in Mexico gives solutions for the quantification and characterization of all the Food Loss and Waste.",
        ],
      },
      {
        title: "Engineering & Social justice",
        details: [
          "A large number of JES are motivated to make progress on the following questions: How to improve social sensitivity and skills and promote committed engineers for greater social justice.",
          "The HOPE project guided by DEUSTO is an inspiring example. It aims to create a multi-stakeholder platform that focuses on the social sustainability of the electronic supply chain (from the extraction of raw materials to the smartphone).",
          "A IAJES task force wants to constitute a repository of learning situations crossing multiple domains through which students experiment interculturality, and equip themselves as engineers for social change.",
        ],
      },
      {
        title: "Science Engineering and Spirituality",
        details: [
          "The first proposal around this topic is based on excellent courses \"Science and Religion\" already done in several universities in Asia, Latin America, and the US. The key principle is to use the relationship between science and religion as a platform for interreligious dialogue. A task force has been formed to pursue the work, enrich the training offer intended to students and faculty.",
        ],
      },
      {
        title: "Laudato Si and the ecological transition",
        details: [
          "In resonance with the 4th Universal Apostolic Preference, the pedagogy \"Laudato Si\" is likely to give a greater amplitude to some fundamentals of Jesuit Engineering schools. For example: The necessary discernment of our actions and projects for the common good implies strengthening training in personal and collective discernment. Pastoral care will be receiving a revitalizing drive and becoming an invitation to a fourfold alliance: with oneself (personal ecology or daily life), with others and in particular with the poor (social ecology), with our common house and the creation (environmental and cultural ecology) and with the Creator.",
          "And \"Everything is linked\" [leitmotiv of \"Laudato Si\"]. Entrepreneurship (or intrapreneurship) is given a reinforced breath. Because it is a call to creativity and initiative that predominates in \"Laudato Si\" facing crucial issues for our future. And our engineers with an enlightened vision, a capacity for discernment and technical skills will be major actors of change.",
          "Incentive proposals are shared in Cali: Integration of the integral ecology in the academic programs, creation of summer programs specifically aimed at Integral ecology, Networked Data Devices to strengthen persuasive Eco-awareness.",
        ],
      },
      {
        title: "Multi-domains Proposals",
        details: [
          "Our Colombian friends from Javeriana have set very high standards!",
          "Team of students serving the meeting with constant good mood and attention!",
        ],
      },
    ],
  },
  {
    title: "Lot of thanks to the dream teams of Javeriana!",
    details: [
      "Our Colombian friends from Javeriana have set very high standards!",
      "Team of students serving the meeting with constant good mood and attention!",
      "Adriana Manrique",
      "Camilo Rocha",
      "Jaime Alberto Aguilar",
      "Andrea Gamboa",
      "Nicolas Rincon",
    ],
  },
];

const PRECONF_2019 = [
  "Pre-conference in Javeriana Bogota",
  "Bienvenidos al Programa Social PROSOFI",
  "Design factory lab",
  "New Engineering Labs building",
  "Research in Javeriana-Bogota",
];

const MILESTONE_2018 = [
  "Conference Bilbao 2018",
  "Enjoying an extraordinary welcome from our friends from the university DEUSTO, 36 Directors, Deans, Professors and Researchers from 21 Jesuit Engineering Schools gathered during two full days July 6th-7th 2018 .",
  "List of attendees",
  "The variety and quality of our speakers highlights the richness and potential among our network.",
  "Talks about Research and Training on Large engineering issues",
  "CITIES",
  "ENERGY",
  "BIG DATAS/FACTORY 4.0",
  "Technical case studies related to environment and health",
  "\"Alternative building materials from waste\"",
  "\"Radiations and health\"",
  "Ignatian specificities - Engineering for social justice",
  "A great will is expressed to be creative and purposeful to address this essential issue : humanizing engineering",
  "The Ignatian approach to engineering",
  "Human development for future decision-makers",
  "Innovative pedagogy to mix Engineering and social justice",
  "\"Becoming an engineer within a Jesuit University : which specificities ?\"",
  "Engineers for a societal change",
  "Building a successful Jesuit network under the umbrella IAJU",
  "A proposed roadmap for IAJES: real collaborations",
  "Building Jesuit Networks - Ideas on success factors for Jesuit Networking",
  "How to operate fruitful synergy between IAJU and IAJES?",
  "\"Engineering, Business and Education are the 3 most valued schools in those parts of the world where they don't have jesuit schools. One of the hopes is that your network will help us with starting schools in places they want them.\"",
];

const BILBAO_INTRO =
  "Enjoying an extraordinary welcome from our friends from the university DEUSTO, 36 Directors, Deans, Professors and Researchers from 21 Jesuit Engineering Schools gathered during two full days";

const BILBAO_ATTENDEES_EMBED =
  "https://drive.google.com/file/d/1_1lY921DB7GVeEjlPaqEQQuD6Y59nsss/preview";

const BILBAO_PROGRAM_SECTIONS = [
  {
    title: "Talks about Research and Training on Large engineering issues",
    columns: 3,
    speakers: [
      {
        topic: "CITIES",
        name: "Jose Luis Guttierez",
        affiliation: "IBERO - Mexico",
        quote:
          "As an educational institution, what can we do to promote effective changes and improve living conditions of the society?",
        resources: ["Slides", "Video"],
      },
      {
        topic: "ENERGY",
        name: "Pablo Frias Marin",
        affiliation: "ICAI - Madrid - Spain",
        quote:
          "We have to put a lot of efforts to try to bring all the people deprived of access to the energy into the light.",
        resources: ["Slides", "Video"],
      },
      {
        topic: "BIG DATAS/FACTORY 4.0",
        name: "Alex Rayon Jerez",
        affiliation: "DEUSTO - Spain",
        quote:
          "The problem is not technology...We have to teach how technology can transform our societies using less resources.",
        resources: ["Slides", "Video"],
      },
    ],
  },
  {
    title: "Technical case studies related to environment and health",
    columns: 2,
    speakers: [
      {
        topic: "\"Alternative building materials from waste\"",
        name: "Fernando Silva",
        affiliation: "UNICAP - Recife",
        quote:
          "If we can use the sugar cane ashes as a material in replacement of cement in production of concrete mortar, we can avoid environmental impacts and reduce the CO2 emission.",
        resources: ["Slides", "Video"],
      },
      {
        topic: "\"Radiations and health\"",
        name: "Fr John Rose",
        affiliation: "Xavier Institute of Engineering Mumbai - India",
        quote:
          "We can show in India one, that Engineering school is not minded to make money alone and two, we can bring ethics in Engineering.",
        resources: ["Paper", "Slides", "Video"],
      },
    ],
  },
  {
    title: "Ignatian specificities - Engineering for social justice",
    description:
      "A great will is expressed to be creative and purposeful to address this essential issue : humanizing engineering",
    columns: 3,
    speakers: [
      {
        topic: "The Ignatian approach to engineering",
        name: "Aleksandar Czecevic",
        affiliation: "Santa Clara - USA",
        quote:
          "We have not just to provide information but change their minds.. Broad interdisciplinarities...Of course we have to give specialization but we need to give them Breadth.",
        resources: ["Slides", "Video"],
      },
      {
        topic: "Human development for future decision-makers",
        name: "Yann Ferguson",
        affiliation: "Icam",
        quote: "We have to reinvent our links to the planet putting more ecology into humanism.",
        resources: ["Slides", "Video"],
      },
      {
        topic: "Innovative pedagogy to mix Engineering and social justice",
        name: "Gail Baura",
        affiliation: "LUC - USA",
        quote:
          "With engineering environments changing we believe we must prepare our students for these environments ...so that (for example) if a request to falsify data occurs they have thought about it and they have a plan of action.",
        resources: ["Slides", "Video"],
      },
      {
        topic: "\"Becoming an engineer within a Jesuit University : which specificities ?\"",
        name: "Fr. Jose Maria Guibert",
        affiliation: "Rector DEUSTO - Bilbao - Spain",
        quote:
          "From the greek origin, we inherited two models of institutions : university with the scientific and professional model which pushes the knowledge for its own sake and promotes successful professional life. And the humanistic school with the aim of training people in social responsibility and in effective communication skills. What defines our institution today?",
        resources: ["Paper", "Slides", "Video"],
      },
      {
        topic: "Engineers for a societal change",
        name: "Guillermo Dorronsoro",
        affiliation: "DEUSTO - Bilbao - Spain",
        quote:
          "What does it mean to be human? it will be more and more difficult to be different from machines.",
        quoteTwo:
          "A lot of changes are going to come: this is going to be a very complex moment of history ...but it's really important to be optimistic, to have hope in ourselves and society.",
        resources: ["Slides", "Video"],
      },
    ],
  },
  {
    title: "Building a successful Jesuit network under the umbrella IAJU",
    columns: 3,
    speakers: [
      {
        topic: "A proposed roadmap for IAJES: real collaborations",
        name: "Lars Olson",
        affiliation: "Marquette University",
        quote:
          "The idea is to facilitate and make the collaborations between faculty from places where there is a lot of research going on with faculty in places where research is less accessible.",
        resources: ["Slides", "Video"],
      },
      {
        topic: "Building Jesuit Networks - Ideas on success factors for Jesuit Networking",
        name: "Fr. Daniel Villanueva SJ",
        affiliation: "Director \"Entreculturas\"",
        role: "Expert on Jesuit Networking",
        quote:
          "We have to be very clear: what is the added value you are bringing into the table of the jesuit mission? are you bringing learning capabilities and adaptation to our mission, impact or scale.., explorability and innovation..., to which objectives of the higher education secretary are you contributing? to what extent you work ?",
        resources: ["Slides", "Video"],
      },
      {
        topic: "How to operate fruitful synergy between IAJU and IAJES?",
        name: "Fr. Michael Garanzini",
        affiliation: "Secretary for Jesuit Higher Education",
        quote:
          "When I was told that you wanted to form an association and that it would be difficult and so on and so forth..!! No, it's going to be easy because engineers are very collaborative by nature; they understand everything has to fit together and work together or nothing happens.",
        resources: ["Slides", "Video"],
      },
    ],
  },
];

const IMAGES_2024 = [
  "https://lh3.googleusercontent.com/sitesv/APaQ0STs-m3i2Hl0AQYaNPBRTA0hA6errIsDph51nnE3BOYvrbMr17hAJ-GfRH81-RS1lpXkqjAojlaDa6D5YTdyxc0UCS2FYJoDmxGNM-kMFovMOjrQZo_JF-kYrk7aVvR7MkTTruwZnE6yv9FulWI3etajsoNMjMKTQmuoMonkwKI6vtBdye_sYtiBsq08OVX5HQKGsVkIyw4Z6zj7KtwLy_QkXsrxe2kn4spjyTo=w1280",
  "https://lh3.googleusercontent.com/sitesv/APaQ0SSwqo6rznmDZyDiKcBg4tD812w2l-zPJxKz6CpVPV6AlryWlU5YrmwY2ZjpPzNOroSEaG62ErKbMaif5DF3YFR0kzuCnISGjLTDm8oI1PbkGjHa3nWXyYdoTzhVETW4NnJqxh4cfIKPgnQw0LeC-pY8TsSuJh9PAcASh96TDH4zUbQGaAV4kRD8WqSEI2m1Dpf8mkxerVQmuro4Ww-J3eMPVxwReu7lFuUO8FQ=w1280",
  "https://lh3.googleusercontent.com/sitesv/APaQ0ST3gfl7elM6CmtbLfmB7f7Nf3mEtBR2DVp_D66xg34CEmosS8mctRVzE-29Se0RiGuBIgvwJ2SO-ZZBmywxkKFl28Hwmb18DDj-MGI8TNVi-_Z-BVIE0-AnzjzrEpP8MckxuA76wObXGbNudAg3Cn_wuzSroP3ZFZZT-Jn1HmLWs7rNirFXYi2YH6wo6Pf2GGW-O2PKOy6P3sO_xtCxlv52KsUxgN6AWV6SQo8=w1280",
  "https://lh3.googleusercontent.com/sitesv/APaQ0SRGifr-hONRTthPyum4ptzNNx_eEtIA90qdEJj0xjK75vWCbblFSloV0P9xULZwn0zZN8XGxv4nTfgydHwIeEOlR21HSoldZGBT84ffBAE9yNo6nRjz3OatPgxTWBR-mL9P4oqZJlAk7G-s9vc4529LiadxiDpAX535F-qPtNR-UFm2Go8MIuYozg5ZRHC5VrG0Y9edCeVc_pLB-CWRxKU9s0sPXfheShJBXdg=w1280",
  "https://lh3.googleusercontent.com/sitesv/APaQ0SQquC4-VH4ersIG0UQEI39iV1_-trl3ZRgVC8xp4EkjEWGC9k-74XIteI9eGwh6wHy9MW72zriZ0YhL4zCBNif2lbFiWG99CYmiXu-1-bFp4Y07ufrTZUtUrvZZz2xFLu7Y1El8TqpiHEZiRI3ZRF8_lWhUOV9cxAZWfL3IDezfd3ZHAzoVyFn1ejKE84p1mmh4KA7UF5wNwCp5ImDDPpaMN1x3uhgmsz8KJaY=w1280",
  "https://lh3.googleusercontent.com/sitesv/APaQ0SRhuU83wK0Zg2QOjnAaf_24yI3n-CligZcl6oMUyxmmBhAbvUgP9pxCexyoWcXmoVjIcJ2lEMi7FS76KB_C0F_8VSJnWE3idPo2EHZY5MzXBgzdaSted5bJRoPD6Zgo4h6TEKD811MTd4IaxK9J9w98OsBMYcJxsYnALRpIK3kaZHqFBg85KLCf64c-e7x9tjrI5RIdPhRojezJFKkmU3OXGC4Q1UfzpPtV92k=w1280",
  "https://lh3.googleusercontent.com/sitesv/APaQ0SRztjDevkuPnQ7FyjVw_Av-wYbifSQ0bLfalShREBGTI8hImaBTC7Bk5z8zCU4HUSqL881agNFBngBMxf7aSCe2upe3HO0m2OQC6__NXCBHFdtSW18wwhEEVCLq6gIVmqjIPNLwb-vEi0nEknGTLbxRQclj4SOh69p4etMwV26QdtC8SccWBddtm3s_94nIt4HCS8xf8tHjJW26ASNdY29Sv8deCjyciBI_=w1280",
  "https://lh3.googleusercontent.com/sitesv/APaQ0SQWIp0ICSUGIf37p63Vez5bcinT3kDfRQ8lJl6qTXKoPyWEtHWqhcebs41D17jG822H-giWWzKPnx-6M3dUZcm4njAkPf-S6xJv4bQmcfy09Xi0gyD8rxmLHIisOwXHgPZkgVyBIEZWqEOymj9iJO7j7SEY4AmVAcBWv_TbeKXJHEx6hjX36EU1YpcLVKCZt05DCzltvip_-FjOU5F_nHv9ax62Qghxk9aR=w1280",
  "https://lh3.googleusercontent.com/sitesv/APaQ0SQJOGz8AZ716ZPBfG9nBZaFpt_-420rvhTP8Vn69ziUHI0jJjwLS1BMzYSKmsTa6G-86WEHYh0bAMPVmuEf6Axv4nn5A0g5Yv2fpr0_iSBpgREGaU3HiX1O2I54xT3kxEBqjNv_8rscmdfMHJixzMe0NVbcPEgCJFQFBYAMI6JFEzpkSNAQm95uK2qnTeKVmNFB_s4JRws5iGprDFm3kOak4aS-kEZuZQVc3HU=w1280",
  "https://lh3.googleusercontent.com/sitesv/APaQ0SRNeh18T01oz3fFWEpNDVb1KhCXAViCMCnJN9MLKa0iwVgj585OjYbnuHCf4EVcRwBFuYYrQhtN6ELx1f5sqEKc5WrnF-sIQGIywFxRMV3kxMhm7ml8i3Y5PDNSlTZTTWy_Jj5SV7m2LEFUK3AA9zYXKrl-d5mGtorFKsaHKDOeqgQGvf0Gggfn1IEPTQ-qE74EWxsinmWxLy3FTGVcRpnQodOEjj2-DhCh=w1280",
  "https://lh3.googleusercontent.com/sitesv/APaQ0SSxPrAjzV6vdG7hK6tSGgqx9pWHHapJ-TYofe1PTUX9RBahGytTcw2sqUpqUP4HdCGrTjjzCA3qxxEOpNpRhfngzGJfE7KX0tm0GJ0pbRKZLCP5CYv4jh-ohC1fYphovuTUn8L7q-sptl4mCFx4nIjwgYOyzZLQVx6Tbw_kc2nysGlPuGrKUQOj6aQGC9rCxEmlSfG_iMLbaHBHU3kMm3GIc28x1HKI6ejq=w1280",
  "https://lh3.googleusercontent.com/sitesv/APaQ0SRoVwT524u4GqU_z2gvuy7_U5TVqvJkfj_4oi9MJSRebXYU6Qa-ZtBjGR3ny0xKQZwxtdNrq7wCVU92hsNoYxrP_wy14R3qERvFFUZmH6qZU9TuTOsBGVdinjmrue7tTON9jJZC3V8xXRa4baQaruq2pjrvWdQRk6bo-ayGENGZ47B5X5bdLGnikda7GXdCJP_aiL7x9JjxvAKfYfvqk8sgOALONs_AUvQvaU8=w1280",
  "https://lh3.googleusercontent.com/sitesv/APaQ0SSgNBzfCdQWsp9Y7anue059BqJ6QJSM-9fZSy9GFhZpgCCGSS6eRSr5VdBxff5PdvYIVFkioUXxRB_BG2Tryu-oP9IdpIwPyWD9QCg77pObs6cPRRqditmblUx0UgaciA2TbO9bU9qFyX1cAbDhOuRIiZn2yoSuZNq6JJCLICZ7dKi35WffpCGqc_NgP3biDpNHxmEBqmHX3GAqJi4PaJemNKjmRe1wSTraz98=w1280",
  "https://lh3.googleusercontent.com/sitesv/APaQ0SSUu_Rduo9sP5PgkbURQ9zSHIzlB8UiEmC452-d-NMcaWw4-bcUB4bp5nKkZJ7JyF-8PkdOcG6oT16f5HgudK2kxFiEcs1szsOgmGhrigMeeCmGgHJysYducbjgnioO3Anqg8M5aEUf5mBkLArA542cIRNtCXGtv5SnoFk2hUzwmW_mudxHNiVZMQB2L5QDUBlZWxYYocIowJHFk2o35t74oJHHmjCdn6f83yE=w1280",
  "https://lh3.googleusercontent.com/sitesv/APaQ0STaU3b9bG0-xgnd6QOLm7ku2ORYq-7iYjJ-fYoQicKO-_ZP6aSiJlbyRH41d9kR965K6TQ52YmDEyozEQV5BwDI_bn9UNnnLR1N7Ds06MyJEQavDbdkrOlh3uE3AcbVri9w0vwyeSliFk3EJGfYhTEqeOUARMqUic1IQIeDDBgBmp2wbnqMi3KrWq-sQdC6_iHpy2nozyWFNaptPat66mRmWYpke61159U7=w1280",
  "https://lh3.googleusercontent.com/sitesv/APaQ0SRffnLCSNu4n5mw1XeJ8ApVfMUQc5n-KM7r5orW0DYCFRZrtEf_HoQinL_uUjiDFK0wvzX_LOb35nGNNLA5xwR_1-SKQjHmWTjb8CMJu2pJgP5ENTLCEqyooqTDkHXEn5sSLPuErWCIEUBRPzNXZHXmqQZ6ABEb4vIOdVMX0nQo3HhcvjLjh2LHR57jOrbRkI_rK46cbIW4v0Nd8-dFeHz5PjsXB3e5u0hZ=w1280",
  "https://lh3.googleusercontent.com/sitesv/APaQ0SQe9YgAsfc2x8Ws5C2E_WfysVK0ybSLEnY5wUMmS1gbDpYjhSkphrWak-NyROUkuMRkux-itXh7SKsmJ6N-OUmJ6cLxibc6KUfcVMUcP3y-1GlXIQTBq43BoPaS2Xd2nyw7eGvM4h2MeI8x4Zd8EtwjaBmESY5xzyLrRAgLAbFYJaiZcuSbapqLOHJM-Dbt0BEA2xlUtam50ArpoI7dY3Is5Q2j5A8_C0-yfPY=w1280",
  "https://lh3.googleusercontent.com/sitesv/APaQ0SRg3KY0q968j_oj669VKBBsgnJNZ3cpK6vhaY9MDes8uBxL5tEEFwSdI8nJfICRJNHcaxpb7e8msvGnOFXhxfeJdvf4Offn89hIAbfiK0Xw_1xbUxpUWbaeepYlIe5YaPULJ2Bia8R6BO-mFDR5FYJr92cCWqbKqVKHZKmJMmVEVZ9apho8Yx-ECvs6hqeB2a9gNYuIS4bt5BTnatfccFKZQL7NAT7EkdcCpKY=w1280",
  "https://lh3.googleusercontent.com/sitesv/APaQ0SQzOWQCbpnfN9-Edh60OpPvagfioq7Vj0ln-w23qKaRwDm8xjMfDeOWwxu8Mnm8JahLEUz_kPsRmdt4YTqwb9pWOxiz2M7Ylb6ccwjtztkqS4wgWk6vgsGr5f52GPV29-SicXZJsPlp--79cIIdZbE2Nu3ACWL90T6ps0cwha79ueYLZNdREDD9PswDATWu1CEqjxm-27-IJ8VRfETm3Limo1C_o5wEqqsLOnI=w1280",
  "https://lh3.googleusercontent.com/sitesv/APaQ0SRh8HC3U5mc07XLbynNbhcT0wGCl11u2JQLA2a6ds_UHn9KTPZzl99qiRoLUK08ymCSYfIwdCgLU4ilIrotv1U5wqWHlkn4Og7lQ7yJlW7-tRo9OUa9Y4se6i639x5NrUcFQpoz-6UcPeleQuplxZ6oqXf8jdEMEwyaG2cg3jif9kXkEYBV8qqyf8KPWb0HUnmDgTTIdb2ux3OqkhD2XPD7cjfBw_JulRghmKc=w1280",
  "https://lh3.googleusercontent.com/sitesv/APaQ0SSOQ1sjdzOBT00NmOtO1CsdL0loteC_T3NIV4o8zCA31XdAaxhVGDjgoLaT57XsungyKl0yqGgfRMRtob6NjG3RMBQyvcpRnqr68UVc2CirCKclllbO6cN0Wp6y6mUMr83kj2xWt0R7qNwbCBOHWCaWm0mN5GWh7wMcz2uRizyd0p1LBlmFRGx2E061lDEInPcZK4p2icMB0Qx7zlkhfyYgTu9lxUrKLbyyy2U=w1280",
  "https://lh3.googleusercontent.com/sitesv/APaQ0STTVIAiZxCLHtc5n01hXiNeTq4vH2UAYD4J2h6SYK_U1Hzc3H9llj1j0L4zwyiwuobObDbkFlXmrMgHl3JLSea8w8znAkW5TKzRG-V7i5J5G18C641il5doCq6Bruk9TuWcjaZj-nRSNuFF0CUb3PjRbqxAy-rMwCFaJ30i9V5kOePKCPJmyiqRkiOio0lv2U002fjucKeyuRRtEAVo5b_K4ZDWaZYs3nVwzNI=w1280",
  "https://lh3.googleusercontent.com/sitesv/APaQ0STAjc3epVkhpQpnzYpGsNiq6-kJMNhYqGBbVfb-SL0R0w3KOCoEixP3ilPbyBP4sVi1IW8rlsfOzIBk9GbNQN0t7bW7Ze9OOfVxKTwuDb38j9NWQY6jZESPGEahOxhP1r4T-9fYofrq4s7MroxBdwvPiAzeVQ7e7vbCKe0ZOXgojhoJjY5lau1yuKWgDjoPm9qPMIHst2wkqkxxZpfVjZziJsCe1fWqVpcmjYw=w1280",
  "https://lh3.googleusercontent.com/sitesv/APaQ0SQEDzD-tCKFSub_fdU7Hb2fJXg6PFseURKNLpp8JFZQFYMbKey2mbyhP4Wc_KK5xPtbUjDp7KnqUDDw6E2bzzaE_PbDvqt_hGSCD_smBwiDIfiWm8lOiRS4tC27p02fqeV0HDxoz2ZZj41yB0SOfmrm4AImJ2ACYAdWn8Sus1CRb6d0quqRb99CCt1OczjkuTxA7DnWqB9njxNxFoYCvwyewwSCQYnlwpqW0ic=w1280",
  "https://lh3.googleusercontent.com/sitesv/APaQ0SQKpo4JYk6T_gTWD8x7_PlISYZsz2u3n0lnXHPtARXZW1WHDMowzVBHc9Cl9t7hXCQicgLQ_Fblxfl9TIEG39UCIX1MtBQ9cok1cXddNN1VzEC7mjkCsaAeKBCxniMw6uweSZUSAfAVQFZvkC_NYtMMjq0czcrZ-M2XXzUrSmzFiKH2ISJAeyXqikFfuDib5YVL6SuOO99Fp0nWVLw0yGBOkdjYwke1WRRyP2M=w1280",
  "https://lh3.googleusercontent.com/sitesv/APaQ0SQKZw0hwE6SomScbWvY0P57tFZLPOhukD4hIlrY1dl1HjSZ3mOQj81yIkjbNghsoDj4-Eo5xpC1vNN9sAm0qRjcLAA-KvzgUPulzShQ-Gc7S_aSrtFTTnIiq-rF6ABNof1zMbfd9gZIUYuVB-i0HHZw9_V7Bo9K-Yn4omoa2i3AI1du2R1A_nY5sSr7VYXSMRy7ny2ti0G9yHWu_feRjWKmxEnH0L5rM8kvg40=w1280",
  "https://lh3.googleusercontent.com/sitesv/APaQ0SRg84OERw4jDkgb0D_BvT-xGeYaJTQ7Jf02HhD83L7u5oXqA5LwW21ognr3a159QXvoF_PhgqQrRFF6KtFExFmZPmTVmXfTQL0JQT1pemh1i-OB5u1ZE4baVGTywkoGIAO_pE9NYB11WdjhZI5I0OzwY8RQqaw1GXQLgk-Maaf9SAmcRt0QebWS1AzG_i_VNN4xsMH_01LBY6d-Omssvcj3g5MrPhPlhHT0=w1280",
  "https://lh3.googleusercontent.com/sitesv/APaQ0SQIPxq7BISgkavLVCnMnCi9Sdwhh3fLPHXcMeSaDnZKOPSr3YYdJTRSrdKwjeDy2GTtU1qhFCKnIhHuWRvW7KdilU_dsCHP7fqasfh4Fl4fN9cU6LF0Wyjqw9OY01SPE2Q43uCBOgbKlRE7Gyr4Uyhw1H0cvdPXTobKhZQAYkBsmlp4HBgSfhsY77FjkzuvurG1id19S5TBjcKbMps66XbN6jL5lCNNHb9D2f4=w1280",
  "https://lh3.googleusercontent.com/sitesv/APaQ0SRF7VL5m8eJeoQ3Og7PYRr8Bmt1IWjtfJYr6vkj4lQX7Fd0dkCn0c-7rvMKPLxXcpNJcXcVJ9vNIvSkSIH4-Je8MrXNNx8IMoK9gqhOHOHBJS2VVP8Xem7Sfw6ClOi2uWdwevjgo6SNWNA-A9YOLGQWevLFd9abIXg6eXIm6Ijm5C1Fj6tRsnd_5IlXyei08O-Pa-qYpOG4cyYu33nrYGwf7SX0WlJnPuq2BmI=w1280",
  "https://lh3.googleusercontent.com/sitesv/APaQ0SRlVnoZ3AlVTRG0E17JZwZYnO0FP04AGvgEWO6NQiej-mZPSMCy5wE-j1-ySIV6vDpJnFjEnx05UHnIatmKScnVnaFEu_5URGslQv3KooNANPpnPZUfUcZ6-ATM4wLH-gCD5T94A2N60n5nCSriiABJmImtpCEzf4a7mHAgL6mW-A3w_topHhT4-D3_UeATjk7pFHU3w_4WERgj01m2zP8Cx0oPlRWihlgo54M=w1280",
  "https://lh3.googleusercontent.com/sitesv/APaQ0SSSgJG939dwYCQUTswRSgISDsNHQuGRXv_3er8thhizitgCJU8w_NH88sEy66gbaJCP784rOs1fjN3IZIAaKSgSp1-quhWNDoRjSy9PLYmOmDg1GQxUa-dFjpGd_Bt8foGJDCr7easnXi1oqOV2gYG3H8VNRz89Sf2mI1U_qeexl5dYskyhAahv2mhOpf69y2nsQKB_xusIGS_IA4StHBrcYJ5ZCoyJRmvLKVk=w1280",
  "https://lh3.googleusercontent.com/sitesv/APaQ0SR8P_JpiV878GqmONfVjSrSh50HyBd9frrFnIC1QFPEmgBcB18_J4seXEwMHwDo6_5g_mpGiMzU-oP3bFlKD_nXDVZJXS0ohgeBAA4d0tAq3pg0sgAjO-BkV3WrraLAyAApXmHFNVfX_E0jc9VrW5UA-PEaO0OxeXYKT0kdDSO1z9ZmdN0rYhht4lM32ssU7xXpqTLwvmSUUp0mTY9ZfhgaYduTzitgXae__58=w1280",
  "https://lh3.googleusercontent.com/sitesv/APaQ0SSKd7HUSeGTlFNneBTC4uMBUKtKaTZqgkxwfLjblzm697QYIrWIW_s6lfw8SGB4d3t1-RH3u_O2EfmJEulq2pBZASYkbVEGVOmYEzORxOfhZisCITHr6TG_JxVIUTwKkChF-XJs5-aVrWaA9jen0ViHZq99cwLag_opYUpJHSKI6IiNCFDNRlLNIe9SDoNN_1OMOtr2nGbQOoYbgzjJXwpWWLnSbKyhD3ZB=w1280",
  "https://lh3.googleusercontent.com/sitesv/APaQ0SS2r_Vef8zbU7LgZwtYJ0rCWdmbVjUPAxOXlhYIdWEpyvFuRKicvRspt_g9yJp6C9m9ugemJut5MLyZPOCN4_dk_R2AUaSLu98dbwl5C-SLZVR9RP7QMl-UnmR5IitEKIx5vCzJecgh1Y3raDBKnUsEwcFlsNGVsFhOLWs4T4ZCT41WYXdysF0jJUzoazkvnRibBdfMkLvmjbs5LKpJs2x5lWBPa1tssOL8=w1280",
  "https://lh3.googleusercontent.com/sitesv/APaQ0STgDYCMUVkz0JB4WOSzuUCSs7S8n0ziv7AzCDssmZdG7qHWmAZJB0wWJrjb0CjwVSFzkEsC114naCrHNlT_VjeQlF4xaV3kvA7yTcEfkwRQ_GeNO2Xw-X4yD9BoYnMADzHlgUCXtHLq8ElKcAI2EjfQez-eOn9-CT-9Iek2BLWwigyAPTZ-MjQD7_7m5XPQsI8EZAKNfVDincJ8dROkkNXY0u0gZ-8S5VTB=w1280",
  "https://lh3.googleusercontent.com/sitesv/APaQ0SR7oqhSXCXShRxg5tMqxpZhjyqeF8j8nEMPPOKHodIjuoFHrQ1tvV-RvYF3cIW7JAOVCD9my_EHigEuAhXYnmYLfxoKl9tfIgmYNclf8VfyT2FR9KSBe9m04N3rcOBMKoLxRvP7FQVn3zHj9hM1srFSlAfy80Rcdky9LJlQZFGA2bS58Z0D61dhDCzEG0D0V1LqaJUNp6zhexiWc3KJke2bqEfRwmIxJiT8M1c=w1280",
  "https://lh3.googleusercontent.com/sitesv/APaQ0SQijOqPR5n6HtjU9RPPiTCLi2abc6RBtnGEkXcoYDfmDC1OBXwDVT6Wj9gu1nYRLCkYuPueM6JHiLg92FcNSuj_GGEUr5a0NDh1olbwEtIYbdchqdTNPKKKocVT8TGkJMsFUxVt3yaXkJoNxBOqjQ3FCtmvEgQnS95Tw-sFBQ1ZhjfxWCSQ0BGhQlvVjxUhlvpLbtPCG-BFcZpObLteyKww3YrVMhWliQZDjR0=w1280",
  "https://lh3.googleusercontent.com/sitesv/APaQ0SRHlExy3-HdfFMgN_4C3Flmhtj1gHSyPLrYUqQq57DCudU17d3R8h0Lw6lsZTFLVITpYgGxrEHxLA7OmfUkITX93_qp2Ef2pPR-WJPpza8xsm8KMRXZT4mohFW8UBP3E4mkJCpUxVFukCHCtXoFcHzYDUZczIZgMYds_N3-7zv4ZXaOvCegE2kYW2HEJzY1hZ9gfqimeCDrlly5w6eCDwNE1SAlSEA-EWHX5oc=w1280",
  "https://lh3.googleusercontent.com/sitesv/APaQ0STE8ql1gh7NXBkU2jQ4972Ow9V-jfxUPW-4BKt-_4TUu80gHVmsg1Qt1gLikYyvmbsPdb37nVscCWoKkbz53AirqhSY4KUWFlI-H4-VhpfxWXw9r8M5e7Nhp91ILtz8yvrVDQUkuSqokCuDEOsygeLejQMyg5xp8AFklteNkLxuYaTqF3QjydaZhyynUdWe81LJr9g1OXDMhZpMnHAa8x4xoe3Mz0C5q4lNyhg=w1280",
  "https://lh3.googleusercontent.com/sitesv/APaQ0SSj82T-f9uq1SM2Tj78uy_FACRlu38YUfwqrvfCQhCtGTDN52ELQGuOVl5c8nLP0ZLPk9g5_8H52YGS6kz906f7kCFx-WwgoafLVsvbxxB1x-70fLfx52yNmjUmsUsXjtLQ7FC0yXLPYKEzHEnN-me_zyDhVFRBsMXvnk66S9rSGXJzqOg-SsCwf5NHtOZZwL_61ux3LjeQxnVFq-mdXzDg5kCirZVztjXqNxY=w1280",
  "https://lh3.googleusercontent.com/sitesv/APaQ0SSMRVu_tE4jXOnkQmCHV43R1O9q3F9jpaIdBzcNxyG-47A7Zagk5rhcx9y7OI2TG47DehrL7dQlBOg5tHukygB8J0z2fI2jSDk5OHgE9DPbDshJ5Tabrdg1UixsfPNAGVByxFXdHvRlp1gJPo9egWaQHkhiQV6ePBac0PrDYK50w90PvUhZUlZykkYd5D-PVpAkyQh_w0UF7NToNrRoMYpxupOc7eoSXO5RMeg=w1280",
  "https://lh3.googleusercontent.com/sitesv/APaQ0SQ9B7kC_TtzCw2bgT6B234UWJ9kEBLjJJFAJV35DCA2bVmKangz9KM0lLiZPL3Ua9vGzmBOVszml0FImBP-5zqFKkM4QBgIdc8-FakuZs7HsadXAoB6Y4v_frPp83bCMhxFwmshuTMyq0Ym65yCWRR9ubpN6jGPD9ZK2GGNX-50oq26SPHUGW0dxExKKH_JnQ4vC_ldUJmNFE3Bsd1ooiPKbKtBSSfuQzSDPnE=w1280",
  "https://lh3.googleusercontent.com/sitesv/APaQ0SQQCavZzmakA_hWxiYe6LPgm2ydgKEkWnRnck_EdbI89BBDCmfK8VjXXCPj-xBhU3DREd0zlvmtGurBdPxhwAALRYp-xTYnvfM4ReD5LnNq9cJq8iq2F9dC0FhAa62ue2eNBYWMfrTZAEf0-Ix4WozmgaxnvPye-mOjmgsXtmGY9rfdD6pjZM2orv57vbGeV72HJm60wUUUzizoJwgufMgs0qA0GfuRJmL4ZsU=w1280",
  "https://lh3.googleusercontent.com/sitesv/APaQ0SQVQn5W3RYiUnlVge_dI0SOxsXeauqVy8DAtNO3wGCPGM25iGvLI-fjtbnt7CMud2VAAZsSIl1Pwa9YEE2PXSIAtj6rEv84-BazoIz8opPI4P-ZP4jyZN43ytr3JVHz07qavwhVKXqAb-ufieapcD9hXJrlD8nQEL9ul2eLxyzoKzyhY26sdi-l1PhX_nngxXSc9gfcJpLy1vuZBgwJhsuXmZgTML5fXbSB=w1280",
  "https://lh3.googleusercontent.com/sitesv/APaQ0SSszTU9AniiByzqDDMWBnK26J4JuKuo9pgwAR1ekRaUpQFmV_QS0nDGDa0SC-tshYzXmWkwtOkIlUlsu4p6nt_wU2XAirz0HUwVEJ0VaWl0AU7CZUJtNO-FCPWuWP06lkn6gGAELskL891heMDUtuogRziU7dzTcnS8zXC6i3zuik6k4iyC1bU3hLB2BJGAjlCMj_0NivtOK93CUc1BYKTlgFowj78kI1nb3Yg=w1280",
  "https://lh3.googleusercontent.com/sitesv/APaQ0STPKG_4Kymzf5JmJwiMQF-qDPmnpCKi6Czdg9E0qCbiSQgFXOdU3QjsHwhCWxH3MH-NVM9xXB8nlYporh9LVLJHZxayZsE3Dh_jPU5NXs8rWH8r0PycTyPKSEn4-eoPLkglxScNfqiut2dN_kdrKx6zPYXMubBnt839jPBBmuuchxYXfpQcLObcHemgsyu1IGhWwF7q5Fcqd9_x7C6O8bdHgFLEr2Gmpr8_SOM=w1280",
  "https://lh3.googleusercontent.com/sitesv/APaQ0SQ5v84-e_ByJI4hy2P-jkT0aYeGhkEn9-FrmZA21-NPp1rgjL5AC9HBdWPgAAymhkt872nozlcFaIqsK-CwiZkySvXIGPhbZRvgC-9afH86Orhj_8xLvTtBGm6N-l7dfKU3s_tF5S0PUhYgj_26TF0j7hccfl93YFb17yvLJYUNxKrTkxV_7ggjbWmGmd6VqJNJr65arOWjQY4OkwJZg3XGLMTWvN0XTQDwaXk=w1280",
  "https://lh3.googleusercontent.com/sitesv/APaQ0SRH5dQDVMJ88UgAxnt2BFxL7md5aEGZEz42kLh9rOofjDYErietJUAQWfu1MxQMPO4rMyCn-3BUp7nmisBd_IZGMMy57lSsHlurJcXos9B03a7jLgBzJl0CB3OfIGYkY9wVQRR74DsGqnO4RtFDH0dztdQaH43yM9mRbqRR0saZ_Xz8H05NdZkUgWnRTfhvMSOsXODl2hPEYL3zNeb4kKkE2Gq7f0X0ASYtWCs=w1280",
  "https://lh3.googleusercontent.com/sitesv/APaQ0SSmL678mQ1GGc7dx9sjRTsIN0tUbB-Mozu4-7S-khMe7M1rG5v_x6V1btPNY7g1ViEad89tQHXyGVvApB7otKOXmviFjgWV6m7I2Jh_cpgmO_DcqwY1-K82-LDE5qxzrZy6UEtqYIF4kojahDM8eexyNnCPeiK-MwtB6M8Da_ej5h9iTWWfss-cE3SyZFa5hWfv3DqFiAcmQf9mM8tM-KsrohiWa_C61iHdt94=w1280",
  "https://lh3.googleusercontent.com/sitesv/APaQ0STbedZNBfu6QudUK1YYOsUh6OxSJSgePWF_HKzVmK95OMsepv2wgm0TfE9qcIBkkEp0WQ0OAEC0HzjhqtNPmmBUDv0z1UACh8e_CTr0Wy3I8aN3SDbI8imQiOP9oIn6GHVAnNp-VFcQ_3gUxY_YSpnmFFHHn6OYANDz24ZMnl7fKPQFim_S42Ui7ph59pQksEQJcm5SijGqPTripIjtochd5ciVsWWpdsg_HCg=w1280",
  "https://lh3.googleusercontent.com/sitesv/APaQ0STM2a_AcaIwyCqWYmImF8MEuFlV8vOJZd85smXPviCsTNEci5gIhfotML1TkQqUbVKm1mzIR5-r8SBItIH3ULIRxYZ782QF5oTzH0NcJwwjgm3Y6yzzCGJF7ixaxkRc_qQvIo3Qpi8fHXYPsxRdXpSh_Jsk6DM5miKPK0-1xo2qvZYOyexfxyYWWxfNE9rcw7h2xJCTnY6c0HmZGU47E6XQ94Gop5An0vCxeos=w1280",
  "https://lh3.googleusercontent.com/sitesv/APaQ0SQuwJnHgbrMpHY3J9pb_eryhynDVWvOFq0yrhr7ue-lVPGxdkqFsyr9fsSz9RGBMkevdexF7v6zVpmy5_lxjcsP20nJgH1PKLZSXmXrewrFua3vgSYGKQJBNWOZkT0Efuwex-CpVwLBXpbezynVsrpm8zEtfgymQXiWINYukVOw5SgddoT2DTRIg3Sw8nGOUIMYxfCsD7cn8oilvYmuxbk_MOwCeFRKBLwlbbo=w1280",
  "https://lh3.googleusercontent.com/sitesv/APaQ0SRTcPXqQGkyRWzbeU-MrN_EjbneQdlPoAbogQgY7Et59MbfNHbmshqpdM3TyVKCadKvMjQQiXZidTm4dwGSZ6Q3a8hPZgvwgd10Z9cIq65QQQUGAdfyr1rM56paFjIFeIeBCmsCBpNZR4cT4i8O9KCQIYR3cLHlKBuCfoxktKlD6kG1Acs9U2DwCfBctElw8ZjJc6PJm0OMG3lQklVvIsTtA3wg_qtI55amXCg=w1280",
  "https://lh3.googleusercontent.com/sitesv/APaQ0SSCc4SOujlWuxf4QKeVFzx3Ip7Fo8JGanQS3ydWVwxphtzGV68MBk_rF-lGE0ahGsSYl3Q7EOMWTSekrL5OADU8HJTpukars85FVZPzQuIFRpS0Jye94d5ov3YVDofVwwI3gNoE2P2Fol4ITMS_CClvSwiAr83NhqZQnllXpIBwpAwR_SKMrWdIU_4zE4O7pDt_x_N2-UsPvRDBoL9kpLk_7rWYXkqxlLEBHZA=w1280",
  "https://lh3.googleusercontent.com/sitesv/APaQ0SRvPmDzVcX-rOtidfQk5n3ktEKeJ73J3TWZma4rhuMU0eUNbX3dK4LXzGmx9jItyeOJ5Be1D_nNYakRa5fdPKMY5v1Q11sRRnA1YEAw1VfPHVxnuhyBvd-Mmwn7WrKngmw2B5YgsEss2n0NjfCMYVrp0HHQ4o9l8R9fUphCSVwjZLMmB68P3Of5hCth9DFz4uHdDx1nF5ZoBXOkkHLYkFf26eteqbs2O8Mtu2c=w1280",
  "https://lh3.googleusercontent.com/sitesv/APaQ0SR2idenUSL5Z-vhOY0eWE-SWDF7poY8raGLqD1UmLKJULtbIfSaL6lSa34igTNGdfrmpu-zLOMhe-sA9LuSw04cdqS9X1moVE9piNdWRPfVxz_LToXiPdIdZmwed1hCY-JjKfUdr1E2XcEPighIcbLFubgSdFOkfmwYwEpRZhbv2ffhjDwj0E0ZKE3zIkwHQkOL4p17_WqOx-cFn9kN4J3DmotlkDEuF16Q=w1280",
  "https://lh3.googleusercontent.com/sitesv/APaQ0SS8iaFnuFV-Vu-8OAZpWpUcyQ9ih7Zm7QvLun1qc1u2YoujJYiXY-b_0uGoizdhU0x1Kzp9C5pToBDK_NKk6lH1eBj35EC8uK6K2bjcjiQL4S9-3xuN0iMsqaTrp-wcF6DK5czJUfgjDndD8BHjT60MJRgrQi5RrL4DGImkAyY0WvBcSDPuk9ZcdZHGgj4D-iA-MxGZxeIlKeMRRGAnnMYIuaMkuDT67Bi4rw0=w1280",
  "https://lh3.googleusercontent.com/sitesv/APaQ0SQtOLtGkeirBgf9IaXyImOBNebNg-GZgdB12YF_klbDMH6_xp2bxV7MLy09TOPu1ztcSUE-i9vbQmnnb3DsQA0e2V5brH2WqZmHden5kx2f7pg2EL0STDhmbf96k6iMEVIjcpSGTwSUZ8NA7zw69yiMNJ2FV2pJ5peA3hKEaIYVmBSIvah9YvUjLx3nzW54JrrWGL5fYIxPx-RDpPc7qQ1TaYZWGi7p4szlp_o=w1280",
  "https://lh3.googleusercontent.com/sitesv/APaQ0SQ_vgG1bytUCRENnCQwcaC2RySBerFhiZ2p3h87A_O9y4gtWasiL3AdaDgk1rqfJwRrgNYvLxz2C-Udfl_DzHudq69SfSA1nRzh5f7dX4xM939KxCchk9mv2v-bAi_eKG2bABqJ0R792tcaoV8gvH1U1qDPpOZia-FUc74Xu87FPiL_mGudyuEiwK-IARWboiKIcyyCcYeqKfaDpjbBFZBzKcr3vvHq4ZUU=w1280",
  "https://lh3.googleusercontent.com/sitesv/APaQ0SQ5p5aSO0kh7bEJCfdCsTfEvjegPgODPPOycqM41ko6rEh74zsq-o1JAYjVLV4vbBNSX3iWgd2aOe4OxmAePrjJ_RaWlezOn7S_dAEckbMcQFr1703-aqwbmkAUNhQghlaA520pCM34PZYsYO8N_V8PyoPwXSDBHY6zagcUjPpL9kfeGB_5wshGK7qbHcqwmv4_6UFsMMazKxy1O3qPYjWqizn398VYB1vMzz8=w1280",
  "https://lh3.googleusercontent.com/sitesv/APaQ0SRXbHzWJL-Oxf-jROZSjOIQJo0vZD3R7VvAjlR4F6rjfdfkKuUDVsJg4-5PtB0jADjgVh9KRqrRYHztBa4xd7Eg5VupP-vIHN2LHP1AUj_oVmLNQShbtPpi-tdEJ2-jVh_m54Ycg_9aEraCv56W0TNtjTczewmYjWcYY1aXZjSMP4Q9c_TDrP1GcJNiVAWaJ1i2dFDwtvnBD8dC4BO-nUmu0SeDV6p1KN5UAFA=w1280",
  "https://lh3.googleusercontent.com/sitesv/APaQ0SQq45IygmpqvrfhKTs5HjFfi8vnnaoHzfYxEFg8GEYaZwzD_98eOW10IhgPx1IfLgNmukjRGU33RBaI9k-rJ-9e3zpZ4ohqvrtMNl85yMCugco7gY_k25xf2nBkaLELgA_-T-bG3kpGl5HJj3ZtfeKS1SRUUM2D8_0z_UfvlyIsczYsGUVo17vd9IJHnoz4ElxODrDruhDJaK05Dgvr2eWdriwzXx1VEa3z9Rg=w1280",
  "https://lh3.googleusercontent.com/sitesv/APaQ0SSo4hFlrFUENLIJjEOunbh3Ijo-Ic6hbRWR_fp8UHnuTqUIfrqpWPO8a12Mzg7OW3XhVrLXMvS_tjQ9q6DJnhuOuni5h1aVZpIEoIvlkes1gTlHf7D8UBPWxf67osef-0ifuih-PY1bSzBPTrl8Xp4p8N_aUddFf1HJ7pGt7MMLHBumQic9OgvtFFlr1SQYw0FNiiKRwsahEbE8Ku9VTD13WLMTxtf4cgHg=w1280",
  "https://lh3.googleusercontent.com/sitesv/APaQ0STzIqI-7N0DyXQhi7QT1AouIsNJAL4Rs6MLLjLDzeySxB1FuD291pgltiE80Zn9i4W2z6mfg0oo9TbJjcJfUQXkCYh0xCL0KZLiHgTfs9Oe2fS7b9TGqXriVXIlnzHYh0Q-rygwNAZUDPx9nlJOdXFGsDGoImawR8edyv5hV0rxJACU-pL0FShV8FwGWxN2U6iSFbu2SS4hkp8_zyOEbrwRMdjLi0aWIFvA-Vk=w1280",
  "https://lh3.googleusercontent.com/sitesv/APaQ0SSjMi1XVJRC5fWGU1e5aUcKfNcjecIxaaUo24lEpkjJNrAejVKIng0BDe5XAOoeVT9TDMPnw5aCrukYqdb6KzGvL4xdqvIPgvYPRPgNZN9c4qsiM4Vsgz5vhdDT1r3pNjmYQWtub4I6XFaVy4VwrxLvLSNIPgujY3EZVcwSAxDa72e8z-ClT631dPk6Wrerged3BxPuibUNLbF_zj4xSgBEJ5Rigjy4ir9GQvw=w1280",
  "https://lh3.googleusercontent.com/sitesv/APaQ0SQ3Ib2szpwp5LcQcz7ZmYjrPGcF7boj2x7RzvhGfMgSWjDS5P6tCOIofaqohxeE13vi8g4qB-XjTqZx8z6DSa3XZZElKnSNNI__Lqa6CEVGPUAc32ycFds-3ecrRvh0czCM2dVfe6zYKBHTkSS-e35hzF6QZsSWl66-c4iOII038RIWRRcIiD2m_QE-60kSuoQ9L4ht9z1ICQVtLo-xf4BvmHQ_tSSrh5QXfCg=w1280",
  "https://lh3.googleusercontent.com/sitesv/APaQ0SRIVkGemfRnax7CH7Gyp1ViJvWs4q18iOF7cjD5xEuKAE0HGQ2pFZ-5loep38b82Lvqzjp_t4xi9GXAVbVeziq4jjBDmOLeZ5654uue0B_QZ2FxSODIknPSBjjz6MAw3-b1a8Mbrgs42sIDlrbv432c6QmYiKl0Zbr7KTDZKeP9Azn-YPF9n67pXQx0rOXnDmPHlynkl3r_zsmrCDmUTQTmfwQohB9e5jNd8IE=w1280",
  "https://lh3.googleusercontent.com/sitesv/APaQ0STo836wlPzG3JXTw-Ia62K-a0h_YFG_t56ZEWxbzOcQqrSHpU1_wHiTL6YcvzFcuEVCpApf-fSUBKD7nG3_QNdslMNoHEWEk_TwwkkKBtimde7F9FsMyJbB1CcJqhYpI3jTLFpK4n1_XzNpLwVKzuNLju15YYInPJs8V1xQx1W4u5XzY9jwVpWxSh2e_c2DCah1Z8xH1KuDNOiOFln1knyHLwopZpwQTvCK=w1280",
  "https://lh3.googleusercontent.com/sitesv/APaQ0SSnuX_6OCZFbTSc_DOI3p6P1bY58_QWPIGGyhdCloDGauh2-BLsu28hK8EWlsDdZ_SLf5N6usDpXT2Sr024w-ft0UxehzTPLk71JemdZRsP3vPHLcIs2IvewUjWm__FeyIjAiWfScXrOt2pNf1GwaO0K2i5ngJKdyg9_jWYirTnVD6tgLHBx7B6Fb74jOP2lfQyT7X9CznNW0dyojutZw1taCybqHPD6kDuF4U=w1280",
  "https://lh3.googleusercontent.com/sitesv/APaQ0SSApBt8osUPaJBVJSzyLIXotBhEoJ5T7rfiXZEgRvvR5XUUwXGLUr8Gvz-1-wTDWXYJZY9C0us-2B-0Efz2Q93I1_yAf6ezF0HEnYQOS-7MFVU-8KJ91gXmLrJUzoSIFI3WauMs217J0RZNnxPf1mmetO08fNAMhsAIZffXhgU5mB2N9QqRAkXqlL6fGA1zSRQmd1vOfgVEoKUXL6OLDsShizdln7laY6wSxeo=w1280",
  "https://lh3.googleusercontent.com/sitesv/APaQ0SS14QMp5EnbGY6yg8h9osb4RC764MyRWw3raDn8gSCGL4ST1qVJTar7NAIroVDfmS0XqDxAIJZbZnW-ul34k93SJFGKGYODFqZ1PzGI75ObNL3O8vDQj6ShX3tC_xVLacoh2E8zcbkeweHPvYnnPOfhii1wwIztjSDyKBCFvMzDoch71l19pCv88Gx8RwQPOuYO4xOysZ4ckHekPzjKXTX52mQTz0xz7_CU=w1280",
  "https://lh3.googleusercontent.com/sitesv/APaQ0SSoctZ7Rgtsv9SjBWIdw0CmtS84x7nyrDuWNrXTTom_NpfqAt1eOYTb4Cg_mO7OWS20-VbSjma2ivcGHEspxM7jrX2WDddsU7G2PojIefJ4S-pan-twJphm4yLeTNPrkIvvIaSVR6uCiSec2h6pBZcOtM-d2JT1iSR2glUMuV52GPf0f7M0DpooWEG12N2VoPCiOkAYJJAfxqAEaiB-p2lGYu0H8TXhFL_9620=w1280",
  "https://lh3.googleusercontent.com/sitesv/APaQ0SR252mAiVpFcmXq6DhNUvxIAjJQHDoTO7tJYejU5EBxZHwBK6GSmVxSRj16SxEOcaVWw6SIwUVMOyQO2TG4-9rttf9BQNauf1oEOx8t8fMGrgO6l0CSpx7z5KLhWNv_fqVy1IHR7hkP_fd8tmQvFKkNC_q6U3bluVAwkDKCiXxsS94DRh3m119O9H-a-Hsw_Oary8AwflTUPLQCqIWajMtaEbk0ppGuIn9GgHc=w1280",
  "https://lh3.googleusercontent.com/sitesv/APaQ0SRAwDTeq5rtVXheiydQofHaI77Qcp6b2E-sjbwcj4zOLT0l7nYDGG8EWa8k7gZsUWaZPPbbePYfBfKmB3mNY-2fo0KZkuogGsZaBOn05pF7fP6QMHtuR6Oazs7QIDewLLQbogO9WiURD_31ASOeF3P_xQpYQePByRw_BvqHwYQttqJ-xFQX2NLy9ZmM_nUjmP28G7jqaOxe3kCu4TOtA6NUbf6raOSekh_l0rU=w1280",
  "https://lh3.googleusercontent.com/sitesv/APaQ0STiQZEbsXl5l6eQ8bbXrN6eB1jFNtjBnFJ1emjoQGwGPqT8s7RQX_eSD3DlsvvQwBHdP03qff-D5thI1lt9SagBRao5bdXXkkT6T-L0vyFhL0q8mSWgocgVpmihs6SUWTKWpuRrfPj73J5eFo4EdJLpsr6kMvptBw4pW06WvKkTn7qURr88Ykcfp57O2D57Yg3qKwmSiTWtP0iaSi6v00T8VSm-vR7p4wiO=w1280",
  "https://lh3.googleusercontent.com/sitesv/APaQ0SQCmaHFm-84p26How7Fp5gJRwBB-6YR7Jqi4ZYZOfWG3UjRPqV1WQIZ07g7Xpyt3klzJvXyGJ4XQJSKmkOsGmuIneZXrNlLWjA-bY28ZAV4UV_X0CxvB0rk7Zdq1gzYShILiN94N_9lKeHTUwliT1qGgPTR2_IICdxUA-MGmIkI4SWWJesZxhRChvJZ7YDkKgUufMa18dUrXAU_5dU8hWilXshPLByASf1x=w1280",
  "https://lh3.googleusercontent.com/sitesv/APaQ0SRM1s5iP7TwN66hn7cM6kvVi72o1i6u6dziPXYVDJIRUmvwBxkJcMAVPMJGsv7DUK9ZMYa897K2MY5U9x4gfs3QRoKA5e8Kj4KHRNNNkWSN4bR-RGIvCUCUctu2sP1wWwccV4dLktQK3PbKdKjv_yWWS85Ib74wB-Gq9cQ5Mp_PJwudMhueUsbCUPOEJkeM9vKn9EJKC06xOuvXV9iOmKIeZjnOufzN3jMJh2U=w1280",
  "https://lh3.googleusercontent.com/sitesv/APaQ0SRQgtVUk8SjXytely3KseJOaRFjXEq3UXv7UOwGb2O59nKGp3tRvp4Z6Nnw6yg9rkSs8X3Xyhbo9q4dISzYmWU8N2-JPljMOGqxS6KhcQKEkAweMBCnl1WmIGdQyN6UPTTkcc6bAy3JN5inuGPi81VQl7AwaEk7MfCp8hwK24HgHipLd_KtoTT65wOgLfV4ueuEy18uTp1JpnahETxbkYeGigAjUk9N5OlpEBY=w1280",
  "https://lh3.googleusercontent.com/sitesv/APaQ0SQdbySiRI3ONhtbcKI55tOs71aQy0Gk0FBmW3bnqjm_2yaBFHfDcBFQwyt1JkDbRcYc2f_00vq5HbN_bMl62vr8qf7HFwxSK584qk7NY7NERGVtG2K3Hh_EJjapgiDdDYTbW7VOcGkaM4lBufdwj3PolZuvlYysgvmiPnITCCLZGWKD4ahWsdeZwEr6Gdqq1I0WWxoA6V5UmHFerkEHUUmk-t4DkYpQpueHnq4=w1280",
  "https://lh3.googleusercontent.com/sitesv/APaQ0SQ7Uha-AOUgDC6wSKIyLxlqV5drNrBJYoboS34VDmfcofbphyTPV_jMVbKrdgdyo5eyszT5t_DPTXYNN_mMQuGNPjBTC_PDWs7lM8WEH8FCqMJ5U1NH5aiYKTelZdf2ZlVoDo_P5OoU5sqy3WRBPeluh2KSmrKEPS6f_aTE37qXLnImcmWtHBR6srVUlCF7MsNSmTT32ygDBAH8Gu0RWfOs3oeLEjahJl7PLd0=w1280",
  "https://lh3.googleusercontent.com/sitesv/APaQ0SQoDnfCxMS40pD_4BHzoo8XkuSSN0q1tLr373r8vQoZSUnZj6mqxdDpaTyKEYPBmEp0k9phZkRJhgyIsxiOvw_k1DJDyfI_KCkZoA6x-W2thuKvHp-3ioTKj_Nk-ryeG4VST5C1GBUTh_ftT2mqpw9Aqwfm-1JUYaJngiHYd9wYvVL6UeL96sODHPJbG9cReAG9CvZteiLwbQm1Wws0DUhB8U0caVPA_Q=w1280",
  "https://lh3.googleusercontent.com/sitesv/APaQ0SS5wEqMww9_xzpu0NaMYbT14hU2hYghy9JtrM9v3T_4v0zmpf5hng8ojW2WFiIf2pHfEzHM4yeZu2VFXKl_rYT7lZkb24naQXunuTlLDiVH4EEmyCOG8A_j4uLaOMHBivd9ASlCWOzdgm0urIyiObzROQ4IAXgk2-jsgN62vH-BdE35miz0v1OeO0xzI81M6BBhRSD1o_U_LMLT3WxNYxQYazBDE3SZZ0UHEKc=w1280",
  "https://lh3.googleusercontent.com/sitesv/APaQ0SRKepbnbEQe99eSzZ-Trtwu59Ix72toaT9Zt6Omnt-ilV5zGSEsrrB74ihd35VwLGy7EAcn5yrqZ5TVcMo0M6CftvTP8eWU30pGsHsBOHXdKlwhmq_tsoGmylazxOyBVTi-0Y0xILLAdBSGfFpC5i90IgsvV2_UUNRC9laz0H557w0z0L2SjA9a7L0_L1KbYJpO0Zn7pMdIHssc2Rc_cRmUb_cM8qKAbUwO8m4=w1280",
  "https://lh3.googleusercontent.com/sitesv/APaQ0SRbdr2ZYJTnusNr_7Jx6j9LdyLTGRtlwpvECad83Tnnc_k3rwH5UP2V2RjJUGe0h9DJdLPW9m_KT9CH0h24L3WhmewjsTq64u21BQA02ssN43vXIzSFzbrv7eSzbKdwxDm6bbS4GLM450UL1-AS5h_7zmnLthBnAbwitYUk9aa21CjifYM0_h85sXV7rUTWC-V7X3tMKJA6quAXLwmxFXOt3yWoV7WD5Qpz=w1280",
  "https://lh3.googleusercontent.com/sitesv/APaQ0ST1eN1raU-2TLUS6o8oGqETP77mfgd12Zj3K__ep7WJpBv35GSaOfyIwnzz6DMe7b-1nBj7e3o_X6ap4USo8R-C1_L0yCxm78e4VDWWdFpzUBeiTBbK7-MmbvnMP6sxV3-ruvwCgHXkeUCIYYHZyStGKbeks8FU84YZ5qmYHGKhd_kzOHvJGJgIs9xFjsTeiPoln9NiMHfQ4aYXuQ1ZdrjbC68Rwbr74nSrZWk=w1280",
  "https://lh3.googleusercontent.com/sitesv/APaQ0SQQi5pcphbRUBSYguBYgXf-pQC-Czjc___UtQOKn3RO6rGi_JF3a4AMGqohSSFzL2YYSEsEobcqEUFfbh0KRrQYdYTKDbjmfboUBsKF_baBRqcoXViMtVNYPpUkVrg_rDYtH1smIFMBAKdSRBoZDAK1QEkuvm0tx3Plx1S6xdvH0RoGpelWCB5zDTLymOV9lftBWs6nyL9xNNApUpG2B4E3uHqSFGeHP37C=w1280",
  "https://lh3.googleusercontent.com/sitesv/APaQ0STJssme_wvhX1miiiI7lWuJaOGJ0xn2XsWrS6c5q9sMyY1Dydh07k-5Y02rdtohQa9QyMhpCb1OWUALJwG1RkBOZfHjkes4O40bTUap4Cz5q7guLbCPBwA4i3t1Vv3IKXHH4gCiuNAgBFz7ulT1noHP-uluexbPGYr7-B_8fB3a6RNMC2TtCCkea-ZyaFHEsZw4WUtdwAu9AWGdzWeUDOw99v838HVgMBMNa3Q=w1280",
  "https://lh3.googleusercontent.com/sitesv/APaQ0ST92cJ2_SS92pXWS90L8aD2wwv66ML0M_Rt9IQxnc18P4QE-fPQrE4Uor5h0SuXqJeA3cWYujBHl_HcSXTjaz6fayZfEs-Sa1S29dbnDf7_5Xd08fqnl7SadbPNfHWuG8IEr9rVyq-bkusSOgDfkTTBWVVOJ4PwHob2ynulPVmDF0FtliMpkpCBeCJm1xVA3lumPlP3YIvDQ5kootwyGZu_57-HFxMR3FeH=w1280",
  "https://lh3.googleusercontent.com/sitesv/APaQ0SRzP0-CBUQgxA4eEoLLoR2Y2qdXHv5yYn_uRmgXYrBhYNFCDF5_KTG1btnNwFy91h6R9R5xMxtDizjtYD97OStEIbgwdYVAGlsjoGlpo3tMKkJrse-BobeCUxouxcP_8KSPKtDAVVXkNIDOo8iGawuFjXGxR5gn4sjTuntGeqampMyOb3QFUeZx4X7G6qVBmXwO8fd-atKU7fJG3vClk0J60Ca7SoqXzENouSo=w1280",
  "https://lh3.googleusercontent.com/sitesv/APaQ0SQogQqf6yd5knqkqFhZv8hBQFyrgWKhCe1TjiUMWiD-dGsAyr9U9Xzq7yYhqz6NJbFYJPO-VZ_m-q3sAEEmkNoMKphv-At74NJBVSwAOPFacXZmFyGk7KaACOEnOiiMUVY2qoCSFpaD_trz7zjXlbYEkJKsgWcx1MUta9PT7JMhdo4VN51aom1pYg5Eb6kdro_yMO1jJ1DJUp2RWLVwvdyhy2Lq91bRyWly8cQ=w1280",
  "https://lh3.googleusercontent.com/sitesv/APaQ0SSRNLi6lm-jCyvBPetKf0r6CL9adyKKALodQTThNr_GX64910gvrvE1e-aMHk4l0yjCejs8X1Ght5JZ4mXCoupwlSGQOy0vhbiLO_IW4xIvjpxBXQhv8yt6-GBvld5TnUvvVA21LI3Tzi8OznU3jMRMX4kJWSEM5zm9QfTLAhYpih0u3HhRVtmsTfBui85K7aH9dsS7PUIc6C1xDWbDRqYU5GW2AcBDQ22OLXE=w1280",
  "https://lh3.googleusercontent.com/sitesv/APaQ0SQZWQY34R4_cW8HKywvQi5emrVCe9l2Zo7s11Qf3XmTo822w60bRtLtJ0l4TFm_M7oHYt5gdiiYTIhReHbflLv3NQzSfnbWssNnmCWFUNJJdN_fHyhhYlO_PL6u6DUfzWWBtcT3wKyXZskf2YfwW0n1h5BF-qbjfAEfmyaX9KUxEAgjIq1rj9T3ppdYyhqCZfxsg7r7g1MyZ7qhyxbvXPSYfJDYTKDSzD0m=w1280",
  "https://lh3.googleusercontent.com/sitesv/APaQ0SRscRoKtDL7-rsO6bdZ9KgAOQJuIMq0HCvXyOx0hdA2mE27rFb2q94sG9nGDl_OndbrJ9v9ZlzN11kgvRtaQxQbJVucqWxd1dD54bW9SOMVGg00itXJzXo_PAkDf5-6hLsrl_SYF6Rdh4ViV8TWJ2HLVXNGepYfDa6sBDdaIL-2PAM_TWdMlNbNM1rQT-v3ZdU86p2PvORma8hTNEZcjarqTKRZLQtCxcCuxfg=w1280",
  "https://lh3.googleusercontent.com/sitesv/APaQ0SR8PF52fOZbQ8qNFpIQdZQol_6yVs3l898v7ExMj4q9QjCGxAouVGZRvmnsAHkS1t86yFjRo9yyg6VWM8MMakboolpm4lmBko8ib7NMRiCrIU8cdbH6hUTPiqwyu04eUwjxb4aYBQOYZKDV5mFQXnYGO3CpMpBQbvfHCds1UjEHKv08FFsJWdJcG3--PhEWezYFA7BmlNPEg_OsLV-RmAOl_mtRTUhazalQ=w1280",
  "https://lh3.googleusercontent.com/sitesv/APaQ0STJjIpdKrQ855PU25-wdnAbKPNwg0VKZqI_Atp1L2Un0934WfjpgUDkCwb_QKDuTqKSYOvfN2KhB-NrArMgBlERnq1hOhDBjhmzwFZRl_qh47Lx4d0ev6DjZgbYATf4gQxl1j-Xfd6ko_dtpV2KvZSOn8qlw1YXbLPeeons9mbLtfLVwjAetdsckUZ2s3vz8PTUpYt-P2Dg1lxJ_knFft1ktjbUjx3gKHCB=w1280",
  "https://lh3.googleusercontent.com/sitesv/APaQ0STAKbpNhEa3AlbSZ7NolbmTJqCf072zV_MUrjK15grBQ4WA4OyYbEcsVDA0jBYz4gyVBDcR8PkQaNn44L-oR4AiLJ7V2HamG36OhOJaFZRWaD9AlnN2SsGQXsrybKTZwc7Lv0KwSTAHvdIPsMBGSWGKFu_IzvUvE6mOaFv2-J2FdTl6zrpJa0hTZS3FdmObTg1lrZ0mmqlkTb4IW7saCV5WIV6QeH8laxopldM=w1280",
];

const IMAGES_2022 = [
  "https://lh3.googleusercontent.com/sitesv/APaQ0SSlNa0J86ZwwtZvIsjvpF5otcNqEvc0ConfDZ7isDP-ewHz2vc383kKQ09TwBxetYBiVje1hDgT6CZy1ce8xoFMxrExDddxtXH1kNsKSo1K-475_KfMNMXjnghrMwCvcz_CnhBTagAoRI2uH-A_gNskJYYnYybGdNSRLywyuAS7q1ij7XeEsl-xaMBAFbcQqF7vqrXs0tawpKpLsheLONwqWCcnOnZrx6x1=w1280",
  "https://lh3.googleusercontent.com/sitesv/APaQ0SQtoCdF3gAT7HkZN0oNcKCZYsC5HxXzGYRMm0FocvWXdPVjBsyz5c-Xe8sUKJ6rXriq_IR5dBFCLmhuFpXExPcDwH7HoxwoZnB7j2ZTnEx0xWrRVBKX0aCB7l1sVfbX0magiLlH6lPlIq6JJ3C6yXFAJJuUeno0u9tPY7wrMw2RtOR7Y4u8dID8_V1bv5-ZoXBireJfFh02vvw5JvsZ4QsDOjO4ohYbPXWiVQM=w1280",
  "https://lh3.googleusercontent.com/sitesv/APaQ0STGfXYELfsvuU9up4QtdLq3BewRdD1aPa0rxl2DxqCyiFDtZqQANFmM27wL_RbweySWlMWKLepygcQvV2TlMHPug45JwgKnAMvMnNUo4znL3vfUwcR4MAlci85f8QxtUQxch8topmV2U4jolqEso4hf-DIZdaJSuCp5eHzhxaHeCS7hnth1fIAz51WuDLrjVdKxpFjWnzs3ffDIiBMFizj29KOfnDzXx5KaxG4=w1280",
  "https://lh3.googleusercontent.com/sitesv/APaQ0SSFwqhz26oUvpv9tBcxId6qGDcEkjngaMag4ie0M3dsN4rZ-fZUFt7zXkpRIsDhs_l5QyWroBuCNZBWtUueRjXNHp_F0ZiVcymfckeZaN7Q146N9fVR9pVqr3xYiTK443GkQ9Fw0dqBugRO_IH4o9p23dNN7Xp2BaEOPg9DOVzCSUby2Pd7pSCxTb_MLhG1thToO3b0ygh9EDcXIAyD3Up1-Cw59ZUB6wy4PbE=w1280",
  "https://lh3.googleusercontent.com/sitesv/APaQ0SQdkAMKbnd6ZSpqUOdKP4Cl448_6kqC1Xz8yDzinRaWoW6RvhPuDZzkuCeOLigfprpUBfdZXDNSJrLePvSZaGUZnJjQeYDr5Qi4_acxMFvfGAb5gJBXgnR3zh8WR1wuXECpLzkUzRQEqvPKngMY4-vEAkCyjGeBtYE2gVM_ce2aAsx6rS9M8rI0_SX4Co-IS5As86oijzs4C8dxeQywvRLzuDoc0eR2uot-D4I=w1280",
  "https://lh3.googleusercontent.com/sitesv/APaQ0SQJS0Mnkxjo1RfM_v-ZzrgwVztE0GfW4Gipu4hDWNwC7nIPBJtd8dzFlbsX80HCuZpxx9mhthVlJNjaNA7gqUiPp2HgYfoUMhc1P7OWxr6DqBZ5co-6eKGhZTV-sMPF9hQAPys354lrCGJ2nTTnjGn2cXP-pa19-0L1Noz8qzHH0ro02Bk7yYvo-87Mf1CVwd3ZvAQw_-7ITacq-SXywFQMM5bHtmq36OCc=w1280",
  "https://lh3.googleusercontent.com/sitesv/APaQ0SRX2rKo2n03fiZ0l5O8N8si2lj80_c0nbnadpjLihFTynQAVdcZFwd-nMHxme3cRjZoAGVUCIciAGSzHQGhgS3mmSEPCjPa-tfm_dxT2f9fpaAV8HPugurCdxnNjOMYq7-oq_W50woOnKtjOAsGrWd-D3WwJx2hF9lCLKg-XZz1wbtE7jjqcv60y9zAILkYUklDYkxCzzXpasobiYGu8gWARX-YMCRrL8Pn9z0=w1280",
  "https://lh3.googleusercontent.com/sitesv/APaQ0SRf7rmY2k4UrMWXO1T0jIGqQeqpG9l6uMAM7n6fQH3ZUMwf_nMzeAkzvaApC7-DLyRGL_nDrmRhFq8WBB-dCrdWR5dVxpk4X1zVoDTbP0XFhcHSP891l5TDRwauA-SehZB0Bp6xluHI0Jaf5yZIVX40OsYKEIQFhRUnQdOzSeuQV5vS5uTU6koyH2xgs0Ob18zbEAh9XzEAh5_JCd1EsI92SFW2MdI0KyydBA0=w1280",
  "https://lh3.googleusercontent.com/sitesv/APaQ0SSRZnbrswXzeURy84VOH88cIIX7s7CoA3lule0KdOb8K2RjE0Y46Er9KFCclDmJvmcLZUdOGynzU3JBHiwEU9jRE2nPWOIinCk9ppNXQuxgHFOdZwKVjN2L_FrZ4a-gIIpLUGOHIUzd1LC9cUqjORdyRq_JkoyJ-mc4wfmKDlnVSvn35GE1J_utJmSximGlfZ78Otv0U7FMe1iVvefankslOw4hirtP5C5QUwg=w1280",
  "https://lh3.googleusercontent.com/sitesv/APaQ0SRYLYWOfuZJ0pHC3wAq0PcRpsjlttzM8gNdRkOWcurwzPaI9dL-HHWHJ8Ki2G5M61POMbcUXxC7DKYhDIXGUlKgGN1TLx9v69zmC6IuhjU9wCYON9-_u9khOHBtUul5DIpreulAA25Qhu5wjkyuQil1bq9zOtFuBNQxZS2rY8BuPkIZK_Qp15IegmUsDDN7mnn-G4JUR4_DGlN0GpHq_bsSKwLdzMLMFZgsKV4=w1280",
  "https://lh3.googleusercontent.com/sitesv/APaQ0SSSSsLOEBcB6LbMm5nrB_a1sd2fAIq-f1YW_kJ99ksooXyTxYHoCoajVklwclXV-mPjV5MpcxXUIHI8aGNhq_tRGKP3_4qQaNhFnIx6rLeSQt1emyg347r_whBD9DYfJ1bRmQ43OQPx2RGWQ9Ytw528LPp27aTk4SUZLJY9pqW6qf9NkfWGDDd40VxiNWPlOsR4mooKRFDLtHMjV8dRkx5g7jW3z0JtfOZgFDo=w1280",
  "https://lh3.googleusercontent.com/sitesv/APaQ0SRPRSsHHzq-63oLA_hVVxXDzcvSiawZ0ESuTcs6jc3iwpsRDWAFc_7mSEoXUjvbSjPN5RWVflNoxiD9VLkc0slVLl7wnckSevmhAwvu6z8lNn7hQMFzCQRpSGalb9JBFHl7NzlWR3F2bmA3ajFj08r_qWEzG6mKDjSdqwTnp6NgeINyi08nSC9SSegzMVNeb2bwiqlnLBkyC21TiUhKDdB44fZinWHE7yhd1x0=w1280",
  "https://lh3.googleusercontent.com/sitesv/APaQ0SSW_cDdAKxE3Mz5snObaoj78FqoUZ1-ibtq7LOugwUo7CYS--AFbE1Ys4ZJoAabEZg78-viuMCNavMqnm7s359nQ7WbZA2Q8ImTn9Af5O7bzl3pfZsDq80f5_NSjYfU2DR-BqaPy3RXwQRz6CGzUzfKD70lyMm0KrPChdcyB-ouCDr2tvbgINIWNCSwRF-kalrQVpsMts5RZ5TbE9_Ls8YkjO_Bvy65V4e_Dj0=w1280",
  "https://lh3.googleusercontent.com/sitesv/APaQ0SSG97jkbikP8qbqRY4fHOyZ9qkMLk7NdR6cl7R2aXXBv_htMCNyKlT9iBM0jEtvIQbh-RYTd8IDdYbNNhaFnbv9yuHB1FQjWSaj9522IBDAwA95Ha3KMFJf0_eoOAqaKzfUH4d978AghK1Vb_a1SfZP8qwTC9V36MnO1eHFXxsViuvQ2TPisPvP_CcRCmLrMawRv6f_WunokrtBlgAbEyVpoRuUwHltcqcT5E0=w1280",
  "https://lh3.googleusercontent.com/sitesv/APaQ0STC_kAkdKYAlIwY7qqDsLzCvUnnV6iS9GXSVuiG3jjNbT5Pc_-POalzm3ZXHI0NnnmlNLqoMmqRAdiRkvR769HV5xJUerh2RH5wba0Zgv-bBSMXVYzhCDOzcUyD95moEzt4_QOhrw2P3SRO2FOdv2K5Vr4o8kDAh_n1NvhFIw_uhfHJb-K_ALdjDUMk43OBifSgVOCi9z56pZiGRZ8fBg_6kfuMlPqvPs5Woyg=w1280",
  "https://lh3.googleusercontent.com/sitesv/APaQ0SS9v-30vwOGRoGVY6Njc81OoBTXh2j_tuvIl4UFRCfCHYvPlMB9NONgS3AdkHYxl9x62UWNw3TDvtpKdBwb6BqmkaDqfCz3sSUWy5ZD2hLP_2i2jBCQBqTuSrp36NJ_KAC0QMcgDvujtCfJ9HBCosA5WiMHDSoOONoLcdjstcv0O8J5g_TDnO0bNVwErrE7MltJ2PCouavxs3qKloTUA5Oq1sy6x541-3avSQM=w1280",
  "https://lh3.googleusercontent.com/sitesv/APaQ0STFQROFXwTT3DEPAV5ILzqSA-HWLgjbmtpSUGsAOUqfbaJCcvS0cKdu2b-U_KstsMung5ghJzaS45LO4KlU039KxPMPQtTuOkYZHq8NmlRcY3Qxd_-mwQyrYAXtmLhk7AnmFrq_ZeBYVECqhldpcSbCoD5ybKlqemXnNzuVFDlTgr-2cb5BXNy1OfwMLo0n5IY6YUeAD3W77BNGC8tjRuzcv5aXzt7_lS1v=w1280",
  "https://lh3.googleusercontent.com/sitesv/APaQ0SS9wDp2moYNdkLp-yYK64HQG16wwEvzKXE5xcCJ1gKH8czbM3u9KHCXuuX10Coz7rYAa2PabMJcyCbSUfh55T1IjS1aoxhw48rtQGdRhBU9AUK3bsr36DVuldIMzswXlbbAah-5SP9ME0zU7sJA8XUIdV4okXQSxdX1DtWw1Iqgs6eJaUx0M80df-Xwtx5BY-TFnMN5a0nbcNnXcSnN3K7Yc3F6CawLWRF7=w1280",
  "https://lh3.googleusercontent.com/sitesv/APaQ0SSUHwNqw10SubH5pgBD_zx1of3GtgaL8VvRLJcfjIdPygRK1MMydBUcozy7T7EV3l033jSyeQIVSroJ7ptGKvfaIAWYUVa3h98VucaCZx3S_fuEaY9dtSWjAao6TkPOd0drZey0_hBUlfTlqDb7A6ws1nN5ZNrUUY54Zf2r5jHhh_zlwJ86nllR-cci6K03qiIHNWusGA8Zx2uV6NvrolU7WMK4lHhiadZUOkg=w1280",
  "https://lh3.googleusercontent.com/sitesv/APaQ0SShkoPRC2NNZxM8HwHOuRXeAlF5Jlwpex_T_w0aPWOg1FWMtaAtMniKypLKgTqmGxQBWUJJh29CQGODFqDpTYDOHBOBK6HMp8S_i-Y1NGvGFxbyGA_gtbMOCJbsv7o2go-GTZVU07z0lwClu4OD6IxeVhj6zmkzyeqEl4Y-En-AjauBDKbgq9f--jDcZS5YAEa2eBsqQCctkfwKVMSex8w23-22O4BwqsdNCUA=w1280",
  "https://lh3.googleusercontent.com/sitesv/APaQ0SRCdWhHzqK9edwYW0Qzq65imIiy8WKUwxkC3kGq_2-UsBzGNY3hfmDr4wVPtGpoD2_NRytzyCPN8qmpzKwlPKfZHa7dDnxb486KFq75HBdmXvs01Pj96u3EVnApBYa9k6ia4S7AxqyZ6N6TXjMcNQ-WR_sN5cXtYMDF7OZu-KX1xbRbUXtnztG9zIrYnP_2O31XidBZCqr-1v6PWZ1xkujPbX6d4xDEvVAyr3k=w1280",
  "https://lh3.googleusercontent.com/sitesv/APaQ0SQwLCfQvUluNS_RbLHo3uL4h3rEtz3mjKqBG4WbD8N1ltDLVbT2nY3vXhIU7X038lZysBs5vXrNyBAxVOUFSzPGla82a_fLGa3GoSP2Z_xSr5F4yGnQhNVKWrnqb_8sHM7_eQoqVOId7OEMEcsiZ--K9-I7qAVbVnyEJ6pkQb9yXt2GiZ09OaWJ77SKRWnFWihNrCC5JlAgjMyx5nxCER1gTWZqXf7i8i8J_Jw=w1280",
  "https://lh3.googleusercontent.com/sitesv/APaQ0SQfl6HmKGoCR_e-elvUzuDVT-7xCyhJpvlZo_a591JQL0qudK9y_xhfknVoLK-yo6E93le0YZcwSU__qQA3wTyWbFATyUnA7lKVIOEA3P_dyTCq4vj1r6wqYNvD9zW98GoTfmNiEtNMTiKNNqbMofWVu4rSFoEgKvKTBgse8DPpMC8dktJb6NQ2VCKBQSuHFKWqOeJS_cRKVI-AF5ADliZFGNRhxdV9VbhhG_c=w1280",
  "https://lh3.googleusercontent.com/sitesv/APaQ0SSzRUrEDUNCHx_u0mii3-dT3X9XY80E79h8-mepotzbnHNKSbxEIx-lJPpNgMNzdH-fFM8LF9h_FllPdRCuc-2SHzzVhLxgGVeX-aoN-Ut2oVKj1tZOhF1yxmR60QJwN5LXhIyRv__DxfeM7i9OG8sYKjIG-A9p_lIjdSo0ZBd5vukuwSpW6Pkrquv_oqktFoQWhGiJa_jq5udhDCab88VImxKuGnLmEKNR=w1280",
  "https://lh3.googleusercontent.com/sitesv/APaQ0SQ6TTAap3QmYZjFkzv1PBxQzwGD4GqD3Vb--vGb4y6NmQ1CpGO3cFSeCDoZ8rodhB9XMj_i0ZFW4oXOXtCa0byvQIkaFm8ENtZPQN99vY-YX7gYkJJliFun_wymr_nexBHIcqHI1migHcCiCU9phbppr3L8mwfss9F1WwwXsmnDVWh0tqBnoTtGqi58oaXpxCMSlhtgq0TMJFbX5maiC0cfMB7ED7nNJ-BYntU=w1280",
  "https://lh3.googleusercontent.com/sitesv/APaQ0SQHzUELe-NgN4BKiM55Eb4kLlXVRdgiAnmY-1SkuKESF7JjdDenC2hhDcugR_Z9AGBucGykNwLmUeUXB6eyGhOt9cxmxkxU9ngzC956rxmqQPjEJWCSnwpdOOIWFoz-5H8E5U724Eos_1PQieCthcoAzCZ2NVDADOeu_RX-kD_nvF3uU7smqv5Lld1iNqhy0dUU3-EK0jOkQOTiGTAorty230SLZA6YPe5vRd4=w1280",
  "https://lh3.googleusercontent.com/sitesv/APaQ0STV7jnzHTNTY1WyRMKMG82MJbvNZTzZJgTklWDUJl-fiOeCGJ9-DGzY9bblnybs9rO16y0H5SIX-Wu3eMDFcslaqDgjZH44oryckJIteQLxmwc6VRzER4wTTCG7Xo7-lWAHtJqjxKbYfuq8G_vTRH4zE2bls6LR7nC5300IN4NeGdfU4sQKzm5vlg5b5BfpcYytAMGLTZ8m4zfH5REjmiwr1A9hsNxPRo7r=w1280",
  "https://lh3.googleusercontent.com/sitesv/APaQ0SQL0dGGMOGjaqTU7pStzS6u-wK2h0fp7t-df2TXZOpK7rdVGWIdnEWnV3J3gPqQqwQhGR11sAEzlOJwQPkdYYU9wwiGdrxJmIKBLAoDrtmGqCcKO0iki_RlqBM1RmBoGYIOQ8xFqBiGgb6SOZ1AR8Y7i6mR191EEmHGD6d4xgayyjp5-durfZlyL5DvpFt9bi-BMbePscPkpfd5UR1IhHuaQD1AbwWshm0iiBg=w1280",
  "https://lh3.googleusercontent.com/sitesv/APaQ0ST4fa5i2dR01Dl6O_Ux2aJHbbgJroTjrUb6cfTSmZ8xXg6E4VIrQLQol3BspJyKrmOVQtZUyRejMglMawf-L-TxOElnFTV8gYKLAOkAX82JAQrxx7S-wB9IrzrghZVUQpypTY4NqtV0wMHxqUWBCWmYkKSXQsStXITXUKMnIXqNPtWVmw_ntVrMVzA3pxczaRgBIx4cvx_UIk6LXJd-oz7WldHppey_qgiu0dw=w1280",
  "https://lh3.googleusercontent.com/sitesv/APaQ0STSszllkBvWdoGrmC74dF3Q4KsaWeqRGmkNDQ02g893avBKYaoaaGmIRkuepymthZtqIQzItDINYUjp9P_aO-RFM3lG-FCSddppZBU1DnpQtT0AF7w3x6uDb5go8v0SZtowL1gr583s9sX8GomqbpPLvKzNYL-C-aNhac3YZA6eja4G73uLrNpruEqJW0qhmJHgsAekoG3yR2QvhuxAhX-6I7RDhKStFFpo3RY=w1280",
  "https://lh3.googleusercontent.com/sitesv/APaQ0SQ8bAt8jGiivmEiTDO7LTTVM28Xl3HA9jHTODkxBJVJKrsECcgMst6Bo5_ZARJ6J0obPxFE6Cf8G9-JNLYAnbyz_1vdB1xubfeaJY4jm75laei2idTQMiT9qxRx2VzeziTOeHh40ssqb5uGCm24H_3QcKi9fIb-RXs80sj3dp1a6xlEdERRMkUrHHc7L8vi8Xr-nPu1ZrwTzpk_6UhDVI5FoyFyjJ4j6LDj=w1280",
  "https://lh3.googleusercontent.com/sitesv/APaQ0SSjf500EMNAWyOjNTyXIY1pm5YnOHdUh0oXH1TxFZQNPb74ZYVWwz6F3HhHAYOjG_1-b9ZbwlI_zJpCHltX0OhCLaHzUIT4rrKGD165AAWw_Fyhr48XjTrZ1G4gSLz6Rqp1yamd4U2cxlPLQhbPbXsySctkRIIwc5JV4D8Dv7-AVAygvqUVoIaQF9LBoH2dAVs6XhTUS_AqLIAjpGcCimSHX1HgKky2uwZMHN4=w1280",
  "https://lh3.googleusercontent.com/sitesv/APaQ0SQUbeuKXRvgfiMj2S1JVXtH94tNFzZLVL80kppLWTvmhyAwi3hiUk3w6a2PpssuneBKAnR7CDmknVxTSGMz6SaIf6RveK5dZZ4NcR_M3QJjeWswAUABYy-pa68UzWO96yRLWaWQeIjJrpEelsAVDjr9rmyUtz92KwZuRY8b5acBY9bybSoaedO5BWNUi5GtRZaLy4QcmHWICuf6lalb3xxexiI5BQl81_G8=w1280",
  "https://lh3.googleusercontent.com/sitesv/APaQ0SQf4I7LrSdO4qUYYGylylkZq-N4UVBXIbo67weVJZMtA76Vh7-_swH_NSJmoKUFEZRzZ2SbOt9RLfWqABgWVH4TmU25xUaJAI1PjddCBu1fiTBGJXprQKR__SWgV26m_yWaMBvFTDY5cpM0Vo0POHrgelT6c4kdcwAzgfgZO74_Madsr_mGmC7LKlpsJTe4zFfwNqKn0g0PFJADgHYCtCNK3bINQDNifsxWKeE=w1280",
  "https://lh3.googleusercontent.com/sitesv/APaQ0SQ3UQBMzZqp1IBuoy8XG31FooPpd8Mo608HxmB58rbwhRbS4CYVb8dzK6M5JStmeTikK8zDqQd4s7do64AmoM3ZCPLj0DtGeEyBJ30Ic2my39vjU5nkF2590OBrSD73HXLq-WWSdPCUw3dsKCJy9KFIbihpL4wEhEa_605NtrTBq5dGy9Q_UNnLJ60snSa8YoE-29qNOD8JhFbCSduiaB_eVieOVrRK838uZMU=w1280",
  "https://lh3.googleusercontent.com/sitesv/APaQ0SQkdbUw_yOneSDvXwsOZA8KYI78-rY5PRtGgYATDjA-mxSwJBuDCs9iJ4rUJFJpnE4zcilh5f_Lk1Cn6kFHkq7ziCRR9_sbVNMdrtdDKx6o6U0o45Y4ArNG8Ti4DdK_K_etALeBdp31k0PkdixXgjmgZgk0lZ8cKSWIVuzUzjqQrZ5jfRuM9idDfcyxPnRJXz8PMECBcBA_0Xeyibzp_xMysUw8yOha84Lx1Og=w1280",
  "https://lh3.googleusercontent.com/sitesv/APaQ0SQGrZoL6-FtplE1Koh5KeSkkjN43r9QTvXQ7OK7MA4a5UFLGPOhQfVLv4n0I93_i2DtM8ZZWsylxZrVXymNJ9Vb88yPw83TJNQgZ_9rbLwu76pT4SDB5PxTMVL3sFqo7niLzLAltYEUp_qsbresy0hEBZdPgsowohiuWnaWZyL1CKuCZcQnHiVXQEO--VPEm87ohyZr9SJOMN9bebrPHB-082gKSz_d7aYbK8A=w1280",
  "https://lh3.googleusercontent.com/sitesv/APaQ0SSfuq02G-0hQ49kAmado88nAUPYJkzgYN0TmB0_EiBsjaCAM9u-W7VhGmrHyLnQRwXRG0otyXlYLM1Kj_lvXOHGRa8HAL1t6G0ZNPIUDpu9TlAen9tvnAsVVPIJ0RpP9vQJITrQP1oye8H6slBzpWJoR2jJbm1ufWqSvvcyX0K8qL6e5JJZ9t8oJxQ-CVVvVkxryN-Pxp1___pL-15J-7_R-UzVDpfnQ4YCC1E=w1280",
  "https://lh3.googleusercontent.com/sitesv/APaQ0SSgCKM0DROTixIKr0auwkpuvXWfxulHA3U5LVbZyCSq3cPAcvLD7IFAkf977YcPSNg_eYrHyTyDAIlQH9Od9QW2sb-zkHnHrcaqQkAK4Uk1po6FWsqZckOZ9nKGGGDmvz78Hj4f0VTgQlC18ycdCTTe3puWRIEemS4yWIQFC9CBlhd8Qgmk0pywkcwxVWVqRsqTVmD9Kl0DDbqL-cPwCQ5vslZscwzSZhmg7Ew=w1280",
  "https://lh3.googleusercontent.com/sitesv/APaQ0SQIx-NJAEBjMxDHxW9uhl61vSjJpgmXh8MtadicvKWzKh51Y3FclI4R8uuS62oPP3NdSQglGuvZWxVLw06fuLkV5-4zN204f-Ugqdr7LwTuxWC-lbqp0IOex9NQCdDDxbH_qA7Zd9uL0_GCrqN-uCbk7oFfIFCiDQhfibNO63_o_64_k34HzTsDNvkp6ugROTW344oQUtbduNW43sL6gPJl9t2QEozPYjSkzso=w1280",
  "https://lh3.googleusercontent.com/sitesv/APaQ0SRRPtARVrE3LOfI3zr6q4MOWy5lOczS-2XniyYZLZ6xX5KAT5rinhdrW2Llk7EHplDb4GBzXTeGWcIntwmqZgcdfyJI4saxJx63Pt9bf4nuhEaaU594NhKe4SHGQ7hHCvNsKO7Y1goryHGIm6_RrAa9iZ9ujPMBngx4MWcy4hLaWBh_fdnho05msivVxghHfHpGl32iICMZYRAJEQzTzYm8Aq0xtJQ0VUq0kuY=w1280",
  "https://lh3.googleusercontent.com/sitesv/APaQ0STBuHVhYvqYbrf96GKq7QmodWK6mTYxFes_jr_gJebJ65FS4HYQ-DfAmfcDC_HSaM5Jz3ZjUXM1RjaKaV6sSo5SyUSioGAy3_l_9DE20gI5FyeSYyxUUrA_qmGAvM9uym2Bm1Q3CJU9wopm5vBNIDaJkKlndvonMGjijnFzSoFwyiaddqN37gmYxSh9-jl2BVLnXJ5Xqcct8TKA-IGYxmzEeHQfY6mdBYstoOY=w1280",
  "https://lh3.googleusercontent.com/sitesv/APaQ0STe42W1yAWaIw6eOvh8a8DPpiAcx_Ge7AFuKFGHQX_Ov4jlgKSU2ZTXtyJwkksZmMfgX9rSMpeDeFVIww5v5Tf_fo1eUaSNsXRXr-q3KkEo0jwMBVDO_TIMr89s9ZPFJNkgL8qOHISwbbWrcY9Bnh3sTcX9mSp6rW3gy4bZz8hKAzjPHSZNmrUBE8s7TktdHTC_Da4Jw5W_q_xRc_1kM-sgjuHeJ9kGVys7rPc=w1280",
  "https://lh3.googleusercontent.com/sitesv/APaQ0SQXNXbGwqV-jNcpuhFQXU23D0VRsn_91R-OtVMc-VRCsdFJxQLGSu6Nv1MfoVQK_mB9SaZZeg5JOz5gKGNNlu5EkSS4ExgOqhvXISQh6Nir0OgIIoK_nHEsRxT4pTlyxxFscu3FimB043HJoff8lm9Z9mp7pLZzQnIyoZ7PSrMMuHQrGG88pT8qktb-lRwOfypBRKOfGJcgOT0Oau6Hh3Vsbgi7z84mfyUAyfA=w1280",
  "https://lh3.googleusercontent.com/sitesv/APaQ0SSkamlumZIgEDGiZiivaHDCt4pHLUl6YwaskfH7Z0VYiFi_QBqhTDehu603QTelNynGYoYkls6RZdeQ3qKMD3jAGZs5ILo8vlgsD0ADCTpLVXKkhek9CZuLp3cyK9PiWP7pBEo4tBi5ESmviCEFWLNlDMFH1sWK4JXT9KWNmBF2TAym1dnMh-4XCCXT4AdFQC5cXEWlYPVMozqD8jzHvSfiy-J0n2x9-Av9=w1280",
];

const IMAGES_2019 = [
  "https://lh3.googleusercontent.com/sitesv/APaQ0SR49fDs57444ZXoOofsCoW3fcfzz8fyr4XBeJwCyYwuBBy0qqntNME5xiHgU5msI8MwDclSfQozUdhzYh-uTWU3i54rWmG9jOS1jBpr-oWP1SP3jEdBqeA8imipVP0fiVkF0wHadmDFoBO3N80-1CaW0QI_FO6x6zAklvXp2woV6jEN2bG3cfzsS1aRwwgeZ6HzpOUQxYm1ZF8=w1280",
  "https://lh3.googleusercontent.com/sitesv/APaQ0SRVxvQclP-GoZcealBiAoQ_ZFLD2Y71oJiWT8Pd1GWMcK08a3KAV1i73ETtF9SvDre1T9R2ZxbWuqO_9XKi-UXDMd163WMNx4sTAUPfLQxdVQaQkqOQFzYL7OJ_NABoUJhrrdHVLvCz72pFjumFeqTGx_OjjOWrO6ccZeN9pS2N-5gI0RU_A8OzSsaUUYeK62U0sL05KEEUJKc=w1280",
  "https://lh3.googleusercontent.com/sitesv/APaQ0SS8h8ZVMlSpoShkxh0WJtqDmAyfALI5aobRrXN0ceXIpnc9L6QNJxE6C8r9Ph6XVddRcELIAjRj9Rg6ACSUruT4zg2I44WnzC_wbadVhbjBJdGT0fX5N7MqK8C8syABaYf2tFjmLatcx3xKcIr16E3DaWC5PBsJa_dKjx4ZYojMSgUa_AETCT8evs24M-3nDyLxDOVSqlbSgRM=w1280",
  "https://lh3.googleusercontent.com/sitesv/APaQ0SRAhl2kuM2q3RjgUgFhZcAVuKHZYocywsUR4LMNExrobI0OEKxuiVagob-Dwxuxr8WQWNjAdTENWPe8_g4LZluZwxutuowW64TKRm8PmXIsKvF_z99u6rqijrIrkaSIkYIT0mC77_2FcIgOCzVFKfRInn0C8MOVbPWoC6krdd3Mqxu2hkIcB9puO_XtQ3beV2ZRBzQz7WhA30w=w1280",
  "https://lh3.googleusercontent.com/sitesv/APaQ0SQgv3tWhGR2CoonHVrKbStPT_R9d2ltTjaKJ5lotVf5rZt9Z2hmF4HEMgepxgcjWWH-7F9_2V1DhauIkuagdAZbSz_3IMDyG6yVIcboxmu7N3H60wAgpZ84oI1Fjm9jzWtbIGZmmIB9l5qNqmT5TTLUKXQ6jcYKCpaID50Zge1jybvmzLaPDCECTjMKBsOsavUdm6WVcFc3rf8=w1280",
  "https://lh3.googleusercontent.com/sitesv/APaQ0SSYkboO0py5_lAH2z_xnHXHlycbLcZHsMgbApiNilorZeHKUVEr_iVg5TSau9qxYmhsNKMR5ZC9KEJ7K0XX8a4kWITeEeiLoBWi0IG6x-Raq6APtIxuruFLtDbzueZT6ChUOMpPl6lEkTtGLtVl6im5xpPdI6h4zgh7KJtMBHv5fF1Fkf7kvCpzNPxN89WYWTC76ozA-oRcQ-M=w1280",
  "https://lh3.googleusercontent.com/sitesv/APaQ0STjgltALEbfyrrHh3QwrxNjDVqb5iXT3H69aAvYYlmvbQzyfzDeLOa8YYXdkyTyJoD1nGTx-0jLsrYkwvTJxpmGG3Fut2SHJWLMH61KzyK6H65A6yKViTq0OkuqNm7DFDSxJIiCwRk6vBccGg6AM1ZfMmDjqeT8mZIhr3fw2dh1ckm_bUZl-FVMtAPCdDRPcCSfphp1Y3J8qTE=w1280",
  "https://lh3.googleusercontent.com/sitesv/APaQ0SSB4W60t_W3b70PLzrz8alSnOcW1RsxtuVbIZRI90lvxhSl1ewxivYfR6k9bh_2_p0QV1N2RjRmWWsZ74skWp-agCqGXl3uKGY2SVzL7CHf1GL8MaFf5w0uPm7hQQqYJLkhUeBrPPe8qauuSthAZUeEshwgaBYgePEyIPtbAySNZ6kmsOuN2Df6vODuEshrnGakqYclbOZ3clE=w1280",
  "https://lh3.googleusercontent.com/sitesv/APaQ0SQDulDpF8cWBaXX3IymaVcG59HdWLQCvxOaA9gTc0glYXXDOxl2olvN-p1QUMB2TPkOFQJGO6QzJ98w2ZGXPqlHPTRe38OFnqPrx76dBnPrfK21o79-sSpDI_RMFGqEEDidD0DpfPysRkDU8MhEAVRO4-FJ2j2WtdGIeX4YTacQmDcjR3d7RQVMeLZ5_gxzh5jTN1L_X1lKhtI=w1280",
  "https://lh3.googleusercontent.com/sitesv/APaQ0SRhEvh4tLqwjiNj_ScKEwwTqHs5QARi5bC1VhohK5NEBpDvk9YlUJiTC7JMaO-opbbbNSHUXJfrKZm4Sh-2L9ZWP9sea0b6WGM61-NbV69LnKnU4pFQ5oBBJQfUBm-WRVjp6tFqt_TASqRcgsdfJ1HW7Ya0LG8LiRK-nuLQSDXVqCE9moVrqasIVhtr3t4kwh5UCz22pjuYO_A=w1280",
  "https://lh3.googleusercontent.com/sitesv/APaQ0SSS7O7HzRWt-S3LNzmb0C6_Dapr_HGIANND3PHezYcIRtR3NGQzP2SZFrjMHtjG5E_hiM5a8roT8tPvf25kuL9JjsV9-G2FpwF6DuBkvyl9sPK1H0nOXeVOkV8C28qKAMnCZohfVDQvJ4jEPEaOmK6BW1BapM8LtawU-73_f-HQU0UwsESk0xG9cka8QcIMP-56yVY51VonSTE=w1280",
  "https://lh3.googleusercontent.com/sitesv/APaQ0STe2RvTzKSE_b9IQPPFWKu26eDmzKsg8N2A-trprd7LAkG_aLAm2FCITx5bxW38g1QvYH_ZJYuJUQ6u56-EiPrtnhJO3ND_N-jVdW-YaKWb0uOo5J3yA_KiQwnuUEjNoLgkmbHX9hgerp1lLPSibwk9fsVdiuBYHY0msoZlvuXF6G79NZEaThd-Z2Hr4dlMGQRW8nHF7boz=w1280",
  "https://lh3.googleusercontent.com/sitesv/APaQ0SSeSYmFIbH9kanx2tBObFETNb4oWV10qybS8dFD7PW7nVd3xeMtyAzOVVdsGDT3z7yfb1uK17gM-PkjaM4Cc5VRX5YLmT2EMizhbrjdopGUKQDy3s9ypsDECYs3D4XBot6eGko4wgLZq0-21j3iZnIxjGWGVkvHdebMt5pX5r1PeN9xRCd-rSrV1acZmjRqenFjUSXNFPBDAC0=w1280",
  "https://lh3.googleusercontent.com/sitesv/APaQ0SSP5amaBpSXPe9bQ1PHvQhJilA5yeiR5aynt2Vw1mQxflYTPjNTQJ0r9cIxaPe4QLVjM_zld0Log3EQQuCjK6eZtzS0TX_sRnZo4Bi0y1ZN99FV_R0VLOxC-paZnUmfAiWewC5yqCUdR3YGagjBh8lrVeb54wC-JDnou4DImBQq8b0lTP98PMh_tY1SlupmzCEtMNJr6-G9GG4=w1280",
  "https://lh3.googleusercontent.com/sitesv/APaQ0SSteENfxrn0g_En8DjjgksHBhJ0bLRKm_MdLeosb7VNSqyDs4rq4zO4nghmE0pcB2dI9n9S-4Xt8pvAA6jVeGrs7ykGxee3kFDXiK2Y7oy9JmdC5LJK-r7LCFYSwUYEBpWvcjgxyN1XBgkgPLzy9tjChhFkNpiqYoZ2hZNtInbxrWW1wpxj0_Qaq51yJQ0iMRDZIp6HJUOLsL0=w1280",
  "https://lh3.googleusercontent.com/sitesv/APaQ0STWYyJicWwPnTt2oIpb3c6v7zu5lpHzKnZQfW8PUUs0ty9BRyVnVpkSgX6eI6pdk43--biJskD4ancWucfFpXKdPVQ-TCmGGZrNgo-m6IjNx_h-dYvjYNr4Z3zBWML-27PbQQtw3WV9BqUGYtGM34g5NZLQJfjIZ9EoNZjNVwKJD36X01Pf9JsjEe4-gDgv3Ke-zZYoeOnR=w1280",
  "https://lh3.googleusercontent.com/sitesv/APaQ0SRBl7Dd6wUEh_F-czSmve2yoYoBrnT3coRPhcYjKRVa5szIXLk1EMF1zuD50c10jO8V_HrIV4nX5ESJefFk485Dwk_3CA6aLFC8uKY9NjhdyzGWdlNhqrB-qJRkt8IPb--HIt-dmPbslvBm0ttM0vvQHOFm8pVPnmeL7x-mvvDKv2uuifDa3E5UYQtMrhs1fhIrrFSLJ9KO4DY=w1280",
  "https://lh3.googleusercontent.com/sitesv/APaQ0STvUvFHuWX1xiaOZ3AUWq_-aUwOnOA1POAt9Gh9VXHumr3K32eeMuFue6p0M1GySve6k2Xj5oFXVtstlNtv1XEaInF5blMciJ9iLfbkRfaqVs9Nc0lIVQPDTCeCDFEn4EVpGw53K5V0pgm6f_IrsOBpIGL2WkEK2SA=w1280",
  "https://lh3.googleusercontent.com/sitesv/APaQ0SSXPY0V9vgcZyeUEO3UwaWCYu4eeTl5tNvp9KW5iDQI8DB1xwymdyJyvJdmF-58F8ant1HMwjVcr1INSV6WfQb-LAg5qBM101c3NBKffovWah55Ui4hc048IjN1--plHZXdWrdy_KJdHFNMyyqaTPGa9wk7mpema3DyyFkF2sAEKvUZecjsZLS9RF5IwiFynW_VY_oemd9YSUc=w1280",
  "https://lh3.googleusercontent.com/sitesv/APaQ0SQN2JbbVeGSj8QNx3QrtzmwxRXcdSFjaAREk-yq6xsWpLwBoPE9QPCOwf4nphN84SwqKG6bEv0RgVVUokih0TfGQfMNTwuio-QIu1Zw8VSXM9X2Bd5o_jeO3KU7c1i-a-63dD2BClstPZ5nKAufXDLWpyOysYdBjvIh6UAJHHMsD318NERtYgwoOo7XrJd2QgBOuliAnLwox1c=w1280",
  "https://lh3.googleusercontent.com/sitesv/APaQ0SS1yBLxIKDiXhAFBBNa5mOw0i2VdbyrlbMgu9pgRM6zvtd9yaa679sPrErkqidPceydjAnWWqyJ3a829etTVFDoZIQDYBfHlb73aY-gxOSRMj2ef_NEfch5jqB6iIOZqZPgAMT8VWx8ErgqLqxp4BnpF1PUU7jdm4YSqVIxIvW1UfmbsjNKpwmGteL6_qc3JvuEf-ZQotDI=w1280",
  "https://lh3.googleusercontent.com/sitesv/APaQ0SSWsf5FjxYr3JzXekvMz05YfL22yAwRzUpPHV3H6j2ND4p8mrZR9Tcw-r3qmkb1TPiDHerBCzkwBKWJto9LIaEbimBBlam0qvN3Wpft4dfxE8CdH0skL4RB_-riraSOv5ZmpGrN5oZGLoxI4zuBQIg2yhAUCqB2s_c97n2m-RFMqh8nCJHy1A6yy2trz0V2wOc5xoTWnLdn=w1280",
  "https://lh3.googleusercontent.com/sitesv/APaQ0SQnMWyYkuuldihePpev2uWyPmiK1lvhE1ztTLVf9QOpBwU_pOCoxJ42FcFmE68EWtSLeWUH_ylxoL4EUrPOt-XWqHiPBv-Rda5LyDYPfAb7-mHdfPDNTt8EfICJykUWRMuaww41CQgyKLYQVOwdynA7-dz_NhX3787aoICsyRfixv4e7IiGeeMi9ZVnhOto7k9T3AOispZ6=w1280",
  "https://lh3.googleusercontent.com/sitesv/APaQ0SS8vAr63PKijfC8EHZlTtIdM6qq0PmXVHXLvWvKTbeKwCWJpySWZ1MOCb7oev_2Eum_HuWCVo58WF4imexHbUmmVyNSLkryUWxZiZrMTE4Qd0C5vsTq0tYhGOZY5dQ5jacZWdfZNznD16WYHAwD_YZsTB7378j6oNd69ysTE7u9nnxH2wtmm__COI0eRdlOTeAa4CG9qw4xaGY=w1280",
  "https://lh3.googleusercontent.com/sitesv/APaQ0SS8i9edZ-3K76S6Vy2CpoNWnlzxo5rAOjFKOosOgFj6NR6ej_VSFdVpyoOHB1ySeGSSIWz9orK0R357GK8w3E6BGmdFH1kqYrT7BRUtxa-6308ky6qfsiycPiwOvR0u_ACScas4ZLIh_CI_jBYv07K_vTgyrA3a0QEvGMLbTIdsBmEDeW2UTsGADe-Mt2C6vmebrQXL-yNqhmQ=w1280",
  "https://lh3.googleusercontent.com/sitesv/APaQ0SR2IWrE77muVFzT8CUt9aL-HPnveUSIZZJhUIMEwFwlcFPrJm2s-fA2gynfaXD0xTTDdKtgdBoTOrvTwP1ZU9bGHmdtNDjNd3wII4RjZVjaSeZriCc029mecJg4SEUsHm3tNcVoBlsgpzVCRDRiy1IjSE82eJ3sTvySiB9RJrczKE8SS1Bb4m0d1cvkurRESw2m3cTaGYRS6N4=w1280",
  "https://lh3.googleusercontent.com/sitesv/APaQ0SRxNMuwlQj19qD6bj0_RC7uk3uNwYl5uclTKu8Z7QYDBcj_D1QTBA9wxRsZGjOOA4ZI5lJf7wW-XIaNbQoDZ6sKvnBMcNbTEMP4grFeOgtmrUq3zCXbOo-faarR-ryqBEtkbsUCoXNt3L5HoqTHjxhcpGLTZ91mbh1HsWY0XTkHpiXxxPdKsr4DsAJ7JtwDxrbS5stadiM5xBk=w1280",
  "https://lh3.googleusercontent.com/sitesv/APaQ0SSccvJgSyppu8XZYryhfFoCszU2qDFg72IUeztK_9S1Vz-7zdWcB3UE98-VbmFYrDL8jfVYP-atwKx_J0AdYiywc91T9W4lL1B8QrNNusHs47WG27nqdgzKu2P0E2dT2saSR27QK3y8jPtf8iHiXC9jXsREeTxbF2oXluWl-VB1uHW3ljd5ThS7VCm-fBe49c_Htpulnpn70ws=w1280",
  "https://lh3.googleusercontent.com/sitesv/APaQ0STXxYGtgurdpaoChc57RJ030YydZoCW_bHJVCRGa1gz3NhKYjLqCeZdUIj6tqu8h9NVDBL6Wl1R4ecGsA4HhYLr1tHvptJQC-2ZWbKJ_PSMDf_3kwnHopl8OJYqn3u0O0BGwjToe0daPKQQdka_YHnONUL7QFC2j7W6PkX-1Njn2hT42zo-k2a0o6zFPCyrB2LqOIDaO225FJE=w1280",
  "https://lh3.googleusercontent.com/sitesv/APaQ0SS0nD2n2W55_JZDrB90vLm8ZhTJYSOlIhQM3nr-f7Xq41KlIXz6GSW9oB_XB6FBtAxCmbw4cnQ4e9xX5MEuxQOYAuR3jfmC--6TOkXcyuUeONpkiFi7pmPoonc4tAkZ5n8xgO8mO81oSWwGMh_jjoiBEeBwgq9eVTDZuH2El53Efnm77ijog4ukwjTWyJso2x4WrflfKBn3=w1280",
  "https://lh3.googleusercontent.com/sitesv/APaQ0STRB7mZU9ztP5ShwM8XHbJv-oj7PPknru0B3QHH0I4X3-sbwQf0ww11Ti0WEs1fG4CYZ5YC4SRhKj4Bzsxovqy-FP-KdzJzu8753PIrMa6PcPn0SkmlZn8hFkhh8o7jsL1Gnb6vqmW_aUedvxMvGHhGNHHCbKUy4Zjep4XXsonuo6rQiK0vXTpTnGSico4m9Enek8GJlFz-=w1280",
  "https://lh3.googleusercontent.com/sitesv/APaQ0SRddPIbnnRa1jFXrFi7q-7giK-PF1WDt2B857Ge2CHUUsPwLES6ax5STosK-l8FGHA4V_V40xwpfKQmhIH2oea7sj6xnq2XhIYPaTWsmQ7Rn0OE0rL1Gf9os1qjzzPv8ZeASw5KIbRQn8Y3szk1mnCf59RQ5Ho1voCKT8Z9uSFFXy59i0FJsOxXU2_w3qEOYEeUqeNI0cUt31Y=w1280",
  "https://lh3.googleusercontent.com/sitesv/APaQ0SRY4lZif5I__QePquIJQnuzPaYTy9Wugm0-yfjOHOIVHf_dQztpgcwaWaLMIUVzjkuq9n2nJ9gNJAP4s-9CAUAJ2Rcja749mM6db53NtbCrlZquoWjF9CBkstUmVFKgsj93bAII5mXg6jhwQUOSaMUXp_rR7qjwtkPOGaL3vEipjxpd4I0Ax-Y6SQXXd8jAw3xfbAZC3j4IHvE=w1280",
  "https://lh3.googleusercontent.com/sitesv/APaQ0SRMPXcMH0xGU-HsuD5cYdSCWc87Cut9HvVn9trglzLyH_7y0A_rEvLw-SDcwYVuLr49Kve8Vo7kcCwZOErzVbHJm6abTIxYa1WpdJpOqzGsVWZmtTs-ekqE8dc53MSigLOU7GAmat6O3T9Vn54R0WUv4-WYYLR-9wihOUuf7L79BSAyOW6Sy5wSD6dD9os0LFeycgZXFaEN=w1280",
  "https://lh3.googleusercontent.com/sitesv/APaQ0SSXp0tbXfn6mIcR4uXZrMv6mfvLKxMcJSEIif4DRPK3pj2Ywo2My2e4juYvikvSILALYshcrCOE5Yy6M9BhQWfbP4pOywWMBst-IkoKeLrUTcZ9zDQk6NfqpswYmItSp3IhNLbJOIK88y3LyD9waQA752uXDUTTpMmTE_zvS0phJfvAembBJD50x9010M3u8yr-5LfN5ojJFWI=w1280",
  "https://lh3.googleusercontent.com/sitesv/APaQ0SRx8dAf4PYdzrHzbfDQZwXPdGdXuNRxjBOU5gUF_uwR9EuNqz2-oAxdPo8EvI_a9qc3DDllnD5ThJpX6yfG3RxiotB7pdob_n5zZOokBjNGBY09cc4BJVedIVKuPEVbDR0lNoyI0MjaVLk8e7q42osdwaV7CPRUDRzDy9xbQgEpBILeSE2pkBJ8zWaHpf81CBOfgdZXunbljw4=w1280",
  "https://lh3.googleusercontent.com/sitesv/APaQ0SQ2c0SfiNveGltXgu-Xd-3P8kYnLLUvVFW8t1RPU3ftzHrR2O4TVt-VmVVrjy_kHRVmGy9AVPmUabymeCqrzWP-sDI7qQ73TtzFalzIsGRICmp99mykFkOxnhkLU6bK7YgGoID82QqWqn3_rvZbx-xNlTb4HQis0lJLJsVw0UjLkkQtPxnvI5z8N7T_SRWzZxwy8y-jrv56=w1280",
  "https://lh3.googleusercontent.com/sitesv/APaQ0SShnDvgN_iYkhnBa09v8P7ZZp05tEghLz9i5SaFf94nuySprGbeIe1IX6j84lg7DafXGRkWVo_TedzktrmN4iliZZt6AH9F8FriOZzcX1KdystT_d0KDG3q2EixrMJvDq4Q9lzSuKupjTfZMHfyQsu1z01ArtPjqPFD7q6d0Q6z7W2NrdqZTDHZEWLcgADYpLizfLZZs_2JzqA=w1280",
  "https://lh3.googleusercontent.com/sitesv/APaQ0SSW3ySMr4Xpd-i-uZ79ETiErFAYCNKF4GoMNcHDrbJ0PfASCSpKpYXxP316VizvP2GLut_e1erb7xl0wzyagl0LoSm5Vy9NsGApOP2t07tEve4u-UgcZf9q6_HGni2ZEeZRP_i1mddfv2MrZaHkaD62Xs_VLA_0tK2mfyMXWnUOvq3S0xEWmy6kv86ClrYD6aAGwfHkA62NHVI=w1280",
  "https://lh3.googleusercontent.com/sitesv/APaQ0SSLqiFjdpjbbZQ8TXRBy_gAfrmTsJUR9SvpQ3V8ck8UN8oJQKoDbNL5BX-YQpqKrgDmPjL_UGIKRPmxgBt3wWN3irSE4LfxKl6sVePZy9MhJgpEGW3JyUp230GwqqCNRLAgsxAQa9hMahDZ5C61PIopgicqdnb-1GHyOJUwIET4HmNKPsk8MvJGqbuuSRYTDq5UQls-_tH4iWM=w1280",
  "https://lh3.googleusercontent.com/sitesv/APaQ0STAxxYyLSPnX8mEBUkO9_JaeYQVp7Xsqv2pq3zEovfQa70UXn5SMaBah9rGjHVs-EHgATOe_ms_Su6b_L_IUIYfrPq683r84o8Q3i1v7ZC3D1tn08rVR1ojSbwsgqiKQMlFPNSbh5ARb26vcptQ7ccrri4TkY0m9-nJmo4MBd5zIMhMnhcvUTG1AeWAj3v1qCjA38rL6IIi=w1280",
  "https://lh3.googleusercontent.com/sitesv/APaQ0SS6hU_Yo2yXuD7Vr0lHRaWa5i2VFg2O9_InULUlwfLb9H9gFLtTra439TZQFIazH0GOIs6ENYwVWKI1cYLI6PVTrkyXUaPx8B40UAAMj74M6O9CBFC4mCeql-v54HrXhMFjGL9FbcsmRxWoSIeQ26j4_Ze_8U-s5ZP7Zxq8aix0X6MpQ5wOewGsD6VtSZOIMZO6NNjZqeWk_OY=w1280",
  "https://lh3.googleusercontent.com/sitesv/APaQ0SQUAJfwfyNT4ngPqOjEyIDzqrboV-MF8q5hGlvACzdqRBBka326bJtYUYWgaM8l9l0nwFdDktNF1_X1HMaDWsyryo_RmVsJoOzx2iVP5f1iLvgHzl3V6DIaulfR7HcrDsOQA9Xlbe0GjC-3GDYimpd-6fsBc9vRWSAWzuH2xTNAAVHa1mfinx4KUSw6vuWpGCe3oV2FuGQL9qA=w1280",
  "https://lh3.googleusercontent.com/sitesv/APaQ0STiq5QuOYrqPulftcK2kUzKIRL9WWXOxBsDWAfKA7xCjq1dg02Dtg779wjJQl5MINyi9Ze_Tzuvc6oeIhKccWmOdXAYLxL0lAR24uQ9fuqs06K0gh9uIdBwiIoWgb7xmAlo1iC3olOF6oKVd9sRf448OvBCcCkWo1dmbMMu7MRaa6YeczjkJuVfMhX3xFoxjm6U_j0QjY6q2D0=w1280",
  "https://lh3.googleusercontent.com/sitesv/APaQ0SQOUhZ_VOqgpuZGrP_aS_Ds6WcLNrYgIEhJ-GmUVo9QwXn8XKc6oOfnsQg89kgdEWLpSyeAOsrcp8QxRKo_-z6ChaX769IWpuOj5SyzDqcT1edRqPuFsneWr6Wn9yF8nyS82T7ui3NiU900TbZckJPiQZ2qzpb-j1LIde4hLEJba_38aVCsy0IHmEBEkTXVrXBIw8pnIc3sX-g=w1280",
  "https://lh3.googleusercontent.com/sitesv/APaQ0STlW6hvCUcyDk-Lks16BRhowESiV5dVZiklBcfX08yaPuXBKf7xYpipURwqxNha1iJMzFAPO_T4vclvGgYXtXBLghRT0BjKQLI6TquyZMp5aiex8zL3CC_ugNCIhPJmA5fCM8DLfX_Fb_IcHDh1SiIQXYf02oNOFnjWAtC1wY8jK8rwRrCulkHBmYKhDOsADHzCin-AJNG-=w1280",
  "https://lh3.googleusercontent.com/sitesv/APaQ0STXdWIn0OBa9YEXIS8kMMBbmyWerv3aZriwU3G9avTabVfnYsOK-TvQZ8VV42EoCeSgPq5Okllfk1-YT5ILvdKmh2tog4R3CW4dlOdh3k582KI2qNFVkfDNR6phFuZPsaMVkYXDAEX6b_WuONu1O2x5WZVmfCmmU_wbdkEQFnmA2o7auJSnEaDlvNZNSPHjIo7O3UqDLJW4bVY=w1280",
  "https://lh3.googleusercontent.com/sitesv/APaQ0SRQcVRFEw7O8FRKPJ-SKuAIUPZjpQfoUznfXt3ggkmQ39NASDaM0gOwkgup-aSN3MBGjXj-4lm-QJjSIFaZ-abyi_wfAH6l0TYsoc7b4YPuQY1xvmGmtXdWt5JE5gJsW4UlpH75Xl390wZ9LYoTVk_G1gusUf39J-pOMnVfxbQVJ-UDmjGqA6Jc5oH1PCkGSvKQbVBG8q8UHSk=w1280",
  "https://lh3.googleusercontent.com/sitesv/APaQ0STUZRHQuQ44L81gygrTsUTHVsSw-xHVRD8d5oNxJ4X3PSuMB-wgkloxDhiZHHBhDVUBFeBaqbcBRD3H6qoQGFKX19hsAGbt_vs4TTzHszceCNdRxnqJdBkysjPDJyDyyYNBRElueEyd5ISVvP3yH5OgtlWubDNWsbeU4ZDsCfMZDYfTZ4oXJNPDV1TRn5QCblw7PpzKH2r0=w1280",
  "https://lh3.googleusercontent.com/sitesv/APaQ0SRqekdcMGoplLtWY8fCtjOJ4Z6aExwgRqqZz48s3SlusPqI-sZSG6ziysBX1h1BJkUGuaK9VselHA09HQiAR_dk2ABcTaBtl5_f_rF_MLZrUqBCLcYtwgnLSxII9lytgSSHBCbJQdcBvFsYM_SFQMOPTFZYXBHTTabLE6-LdOnTDFdaljbxNgl9fg3BIl31ctfdZ1mOPZHGEe8=w1280",
  "https://lh3.googleusercontent.com/sitesv/APaQ0STs4C3qijpKlE6Vyh-T7HRWfxa8KXif2Lex0RETa0i9-sOy5O6nUXeueWvybzXyOtHuxtzoXRVOMFhGmxpDYftAgvoyVefmspx9SJsV05KcWoplzlhIFpID9fU4BbEQZu6tRBB4x8yVgRaJZExKxuveVYRI9Q9FUWM52DfTu3Q3OOsnZzh88eYrQFMN5b7J7MCnWruIlfPk=w1280",
];

const IMAGES_2019_PRE = [
  "https://lh3.googleusercontent.com/sitesv/APaQ0SRKyT8-LyQij7P2w-KSGTisler6zaIfzYM-J4__FO641CWQIDB-q_QFCEfdqOe26S0k7CiOQsAmJPCdkYlZ2DgbJ2TclnaMxQPm5gtuTohhUJDni2eYh2idpQ9_je1hpmEdFsBb8Iv4_clxGArRdd8Klu1QI4F-ylA=w1280",
  "https://lh3.googleusercontent.com/sitesv/APaQ0SQY6MWdaGq2Yzev54nlx23QXM2wMUOgkRI56uwdBrMeoygViMf-pzX3JnuCnE_AMiFJMtAaiRvjDIzMowpwp2kguSPWR-L8GmgHC2XeqfnnIpy_FjEw-n742NsVFY1WDLjwfrmmROffz06AdzT2FXTMW6fIu4lcXP3dcLIPZ9LSeDCHGSzdgwTYU8NBjyCpxNOhKRyVgQbs=w1280",
  "https://lh3.googleusercontent.com/sitesv/APaQ0STvjcxAXw7XTzrVfAX6BMVJqzL4U29gvHiINQ3CZUUZDPL_hyV8NCWoesIECJIwT9GRT7ohyRy0YLko79Hig1rJoqCbZYO5FyzyAW8PRYoNeYEVYR7WkEgNvwx_ZcvpI_6hP2v8YFBatK1DuIZ6yeoliLw2adqgDeUZjsIvrGos_A_FZsvkNuMVjbmQu5sTcPLY-OXrvX_DT1I=w1280",
  "https://lh3.googleusercontent.com/sitesv/APaQ0STrdzGbiT88bNVuo5yvt8tE-Ni4_HKZpQHXorXEEbCuitX6Ae5jIQqmHMQ267zDX0q4Sh8BNftyYZA-J3iAYtPvTVnwb0mwgk3h1edp8c9IGPZxlQT96aYitEWfBChF-bQVKmsTMNCVju3Alp6iTAqJrfeTq5KRd0AL0Gnzb0ykuCvTHF_J5fqiKPWAO8fmEWlcNZnYYF8m-tI=w1280",
];

const IMAGES_2018 = [
  "https://lh3.googleusercontent.com/sitesv/APaQ0SRcktbr8sFMIJoznsoR_P-x-GOVsl2xZpev96QPHhG7sVicQOlIuiuTGTQvqoFGhoYbbS7GmMe7Hox41E1ltUMG6w5mmwkNZX_2oJwfLXhjmNJzH3KJRhY15Jyz3fOc2rKSW6K4os6ZIQpIisqGrv-5M9NBkTmsS1pxXvZ74XNwxG-CoZWLTy2uuPTKHAQ0ju-RrahinpbSeYc=w1280",
  "https://lh3.googleusercontent.com/sitesv/APaQ0SS3Ioc9PJU5ZW6G0dInRxie8XyVK35pUvav4mKq8aEprhiCQWlEoMeCGfYbFTnCtlj2Qk6cI-Xj8lAdoYmNKKTXyedk9CLivU6m4_JqCep9bjtxt6iKWX8Wf8B4t8tf6WQYkoiZkMvifxSM-PMArQ4ND0Ja6QL4Pc7v8NTTEzL9wF3C27lGsixUrZmhVSBr71yoTgBxMyAopXg=w1280",
  "https://lh3.googleusercontent.com/sitesv/APaQ0ST-zCQBm-oQzLyatA6cTBGL46wPExgktnwE8-2kn2rzOQqdiZhBnrGBMBUB03Ygyw0TiuJGwQVcY2IYHRJfImA7WBcYpsGcWwgSLwvhMMTyxxndRAEFLYwYDFAC5nZWv8PKFQJLpC2TW0j60z1M2YsCmvEykb1kgkKYtSEybI-6qJ8gwpeRwUc00acO4buevzDnaROW5ZqMK5k=w1280",
  "https://lh3.googleusercontent.com/sitesv/APaQ0STLsu88ST0v8kmz1tEPhxq5otlVvifGto4gV2RWoZHUqV0t5YvoORQWiKpy0VhTueoPki0nmCZmODRFADEfn2dVGBxdLIQ9Fd6CUda5pIkGv88VvlYFpMJWPEw_u7_sEY1LCJLukggfX5-ubsfJZ_lZUaT5x6IgSUnzBiH270Bb0kYW1D6K1CcDVaHY7bxpGM3x5FA_9WNuhBc=w1280",
  "https://lh3.googleusercontent.com/sitesv/APaQ0SQdVCSTG9D7ot2O9yODELZ6NNpgzwDFJbrtiZLh9PllF8vQX3V5k1tEBEHBqgR7vmTA_5mVPOfZFZGh75XznUPXRQLsRrbQr_2lo37Yo3fwwEQZ9WdLs_s0CquiFE6BJ3I3eBAe293c6w0a-HBQd6t-nvIPkxHbv1HRT1xpEdULjXdOrAvjGVsyVymMTTaZyFhCOieYHNqOhcw=w1280",
  "https://lh3.googleusercontent.com/sitesv/APaQ0STPvAKkg56VkgsW5yfbMWrxfLGh6USSDQm3AjYCf8abXU4KHHViLYRefNqeYsP88LTWnLc1MiuL0PcRjQAh3JSGyM17b1A6td8vTZTNvN67_ynBSJxl0JDh9TR2rYUWQWVzalUtz2SapjOKJpXjHQHZ9JIvwOArebikGFtfwMT-flMFBxZWSSkXRAKwqGi0De0fNrSUFuwmlXk=w1280",
  "https://lh3.googleusercontent.com/sitesv/APaQ0ST50rpEpz74caoxVSQC-dvquFPuZh2u91mgjCvp5_i4Xfnlp5GD01Tg6IezXuGGdSJgTuK9SsManr8pLqFt1XXPKwNw28DypLtieZjVk4oMXxrvzl0WD-xTNVClpWQ1DOupHPFxGsc-LBMTor9jOTVTw5oOOFBs91A=w1280",
  "https://lh3.googleusercontent.com/sitesv/APaQ0STWrhnn7dQ3e3_bPS0Y6VWiFGlySPqTJ-23m3A5e1uzfU1Jh79rZy2JvSS7trW-PjwaagYcfKv8zaCH1ZV31UDsFhwGqr0KDQUNc2rlFmipcBP-tBjmvw9ZXQAxeaDxPzPNW2VICe2C1A7hsZcgZaX5FunGXBPT_La4IqonVIr8YCqvThT3lvvWF1Tru3TqeyfoiE7hnOcaxbg=w1280",
  "https://lh3.googleusercontent.com/sitesv/APaQ0SQ0fORg13jpRWsKUyvtsjV3IhZfCwc-LMqvNpUyycIaxcjbuc9o7b8UA9hMObeQare2DEc0o0xEc3ESma_nVT_2Ygj3g-9s2SJVXVNdhWWQam2cBWlNHVjJA_jRCalT89dObsdzxqucDMbdV9PBO0S-Xa66yTnK4Fgam4I44VvLYhKw7XA6Wp-BO-aI68HXZq0Zt45q4uN5m00=w1280",
  "https://lh3.googleusercontent.com/sitesv/APaQ0SQFnE8wbe9w2_uztX1VXKSw8lTw5YTQ8hoyZnoC2MIQuTUvDcRb_QlR8VPvv-Zs09MfDohXgg-c6hwQLlc_EzFwcb22kogOseG_UECuLEqR2yNtM81l2_dk9OvP2I6FT9xyw-fRywqC4dPeSjLoZXcZ4pjeCseZ3Gg=w1280",
  "https://lh3.googleusercontent.com/sitesv/APaQ0ST-iJAkvKNnoMkMQatD3pYJDf_5BRYPxUCVyFtIscewU2y0GH_LK8bOIcRIdS5wiIZNuORFVxRRHQdm61CGr0veqEN-I8EjLWkP_I2fY4bZwV24H8gRw27eByVmoQxD82fe2TY6KwDQ-5-ec3PAiKHea2WOvk4m3_AoRU5Khm3MOcY4pbXfudLETfGvDsWjNfbh5_U1qKZ5K0s=w1280",
  "https://lh3.googleusercontent.com/sitesv/APaQ0SQx4ujS7jm6i3Dy6M7G6gHGrRyzLx19fynpZwIJ2PGKqRs3AXU3uWC8RCCIMFXugm7nWgftVA4WzYRrPB6y1WZnR7DhGblIHQLjEeNCde_iNq88myj1JKL-16ppfZKUKovvAmVbxkGH3BXvAEBd09sD25jkxUsj__T3wjvr_YmvGmBE3BBoa4DKk2SdBlfIG5u4z17hm5KN=w1280",
  "https://lh3.googleusercontent.com/sitesv/APaQ0SSjPgq_i2jfqju_Vs9RWF4Kj9ivBlF8llyLYX1FrZEniYOWNClxTX6pS1PUoNzE2iyU4pL23Qd7gusSA9FNHYuMjLnaLQeqJazc1kOck6IpwSB2yRYwXltGENzyXeyvRSUwmo14karVEI2D27ubkji-RyVUXgSvr_5tNfVmPE5AMT0AaamhK_Aj06OirV54s-fjFyJSXl5pqEI=w1280",
  "https://lh3.googleusercontent.com/sitesv/APaQ0SQSoN3Eo6SDSf1BOR4O5Ws6Yy0x0K-btZH179blVz2geTfk6xIdGmPpszjoor1ItJx3FyQ57z5K1ghXXFEXzZt96huKVasVBizeTlYZKVsHH1pza2gFQ96azduO5pwqBU_-sMg8ORlhorEAsk5DozBB4R5Bif4ZTbNpfLl5JsV8kVelErEsXI46NaqW1PKilhUz2cSWJobn=w1280",
];

const HERO_2024 = "https://lh3.googleusercontent.com/sitesv/APaQ0SQcXJOWu4pSrUSYqlJdSAExPfEy-8AkmcsmX6vUCs5Bd3g9anohFbOi-hysPlpfAC5liTXFT0pmbVT4SN-yYXfvf_B_O4dtzxqzz2PkQTUbYF688_yQZvw00gAo9Z9DotcaSkX5XTvi1xSdk4ybom_nq76JKladBEjA3_r7iYkhh8rLkO0zCK65Rh21nVhsFl4G-p3iCFGp3c5SMApeY3PDSu7PgVKYLMpiRq0=w1280";

const HERO_2022 = "https://lh3.googleusercontent.com/sitesv/APaQ0SSmfEprj37rbsl2Zg7jnLyYPJr9NmtmtoKtNtH7qdHS5SVCqRsZoO6rPw8yYSVY7nANHf5uz0x3_AmlrMc7ZxJGbrnFUohLIQtMrs0v6yUj8o_KaPTmsQpjxMQ8HWpNOhj0aHDSOozRFwBedC1-9XZU67-_dptC4vdV_VKbq945g3Hup8am8UFPEtw5Ldl_ssKl5G-pSq6iw1gaDEf35YxPbLua7GEckbKWdqY=w1280";

const HERO_2019 = "https://lh3.googleusercontent.com/sitesv/APaQ0SR49fDs57444ZXoOofsCoW3fcfzz8fyr4XBeJwCyYwuBBy0qqntNME5xiHgU5msI8MwDclSfQozUdhzYh-uTWU3i54rWmG9jOS1jBpr-oWP1SP3jEdBqeA8imipVP0fiVkF0wHadmDFoBO3N80-1CaW0QI_FO6x6zAklvXp2woV6jEN2bG3cfzsS1aRwwgeZ6HzpOUQxYm1ZF8=w1280";

const HERO_2018 = "https://lh3.googleusercontent.com/sitesv/APaQ0SRcktbr8sFMIJoznsoR_P-x-GOVsl2xZpev96QPHhG7sVicQOlIuiuTGTQvqoFGhoYbbS7GmMe7Hox41E1ltUMG6w5mmwkNZX_2oJwfLXhjmNJzH3KJRhY15Jyz3fOc2rKSW6K4os6ZIQpIisqGrv-5M9NBkTmsS1pxXvZ74XNwxG-CoZWLTy2uuPTKHAQ0ju-RrahinpbSeYc=w1280";

const PROGRAM_DOC_2019 = "https://docs.google.com/document/d/1bi9diq3QV25TPagewwh1akU6eK4hLm2k-AkC7zqMXuw/preview";
const VIDEO_2019 = "https://www.youtube.com/embed/A7UL3erRagc?embed_config=%7B%22enc%22:%22AXH1eznjGKsIqTG5IyxYQqbAYm-vqsXGZgXXL0mY8JwW1RDQRbCN-JeCOvglg1JUVteVNbAVluLimKvu75Cvhi5hfX_eJIocwc9KHq0ntnA8bMDgjX95TKewISptVtuVlQgc_6wKuCICidX97hZuGOZZJksrwjihUU1tH2foKIePtvno%22%7D&errorlinks=1";
const VIDEO_2024 = [
  "https://drive.google.com/file/d/10MHYm7u4xFFJUmEt3nfRaJtBhI214xnV/preview",
  "https://drive.google.com/file/d/1_pRj3J8f7iDs6Oe0zu88sjVEEwkEidcM/preview",
];

const MILESTONE_2018_INTRO = MILESTONE_2018.slice(1, 4);
const MILESTONE_2019_BODY = MILESTONE_2019.slice(3);

const MEETINGS = [
  {
    id: "bhubaneshwar-2024",
    label: "4th Meeting - Bhubaneshwar 2024",
    title: "4th IAJES Summit in Bhubaneshwar, India",
    date: "July 10-12, 2024",
    location: "XIM University, Bhubaneswar",
    heroImage: HERO_2024,
    milestone: MILESTONE_2024,
    mainProgram: {
      text: PROGRAM_2024,
      schedule: PROGRAM_SCHEDULE_2024,
    },
    media: {
      videos: VIDEO_2024,
      images: IMAGES_2024,
    },
  },
  {
    id: "boston-2022",
    label: "3rd Meeting - Boston 2022",
    title: "3rd IAJES Summit in Boston, USA",
    date: "July 13-15, 2022",
    heroImage: HERO_2022,
    milestone: MILESTONE_2022,
    mainProgram: {
      text: PROGRAM_2022,
      schedule: PROGRAM_SCHEDULE_2022,
    },
    media: {
      images: IMAGES_2022,
    },
  },
  {
    id: "cali-2019",
    label: "2nd Meeting - Cali 2019",
    title: "2nd IAJES Conference Cali July 2019",
    date: "July Wednesday 17th - Thursday 18th - Friday 19th, 2019",
    location: "Welcome in Javeriana Colombia",
    heroImage: HERO_2019,
    milestone: MILESTONE_2019_BODY,
    mainProgram: {
      embed: PROGRAM_DOC_2019,
    },
    preConference: {
      title: PRECONF_2019[0],
      items: PRECONF_2019.slice(1),
      images: IMAGES_2019_PRE,
    },
    media: {
      videos: [VIDEO_2019],
      images: IMAGES_2019,
    },
  },
  {
    id: "bilbao-2018",
    label: "1st Meeting - Bilbao 2018",
    title: "Conference Bilbao 2018",
    date: "July 6th-7th 2018",
    intro: BILBAO_INTRO,
    heroImage: HERO_2018,
    milestone: MILESTONE_2018_INTRO,
    mainProgram: {
      sections: BILBAO_PROGRAM_SECTIONS,
    },
    attendees: {
      embed: BILBAO_ATTENDEES_EMBED,
    },
    media: {
      images: IMAGES_2018,
    },
  },
];

const PREVIOUS_MEETINGS = MEETINGS;

function SectionDropdown({ title, children }) {
  return (
    <details className="rounded-md border-2 border-gray-light bg-white">
      <summary className="list-none">
        <div className="flex items-center justify-between gap-4 rounded-md bg-primary-extralight px-4 py-3">
          <span className="font-semibold text-secondary-dark">{title}</span>
          <i className="bi bi-chevron-down text-secondary-dark" aria-hidden="true" />
        </div>
      </summary>
      <div className="border-t-2 border-gray-light p-4">{children}</div>
    </details>
  );
}

function SpeakerCard({ speaker }) {
  const resources = speaker.resources ?? [];

  return (
    <div className="rounded-md border-2 border-gray-light bg-white p-4 text-center">
      {speaker.topic ? (
        <div className="text-sm font-semibold text-secondary-dark">{speaker.topic}</div>
      ) : null}
      <div className="mt-4 flex justify-center">
        <div className="flex h-28 w-28 items-center justify-center rounded-full border-2 border-gray-light bg-primary-extralight text-xs text-gray-dark/70">
          Photo
        </div>
      </div>
      {speaker.name ? (
        <div className="mt-4 text-sm font-semibold text-secondary-dark">{speaker.name}</div>
      ) : null}
      {speaker.affiliation ? (
        <div className="text-xs text-gray-dark/70">{speaker.affiliation}</div>
      ) : null}
      {speaker.role ? <div className="text-xs text-gray-dark/70">{speaker.role}</div> : null}
      {speaker.quote ? (
        <p className="mt-3 text-xs italic text-gray-dark/80">"{speaker.quote}"</p>
      ) : null}
      {speaker.quoteTwo ? (
        <p className="mt-2 text-xs italic text-gray-dark/80">"{speaker.quoteTwo}"</p>
      ) : null}
      {resources.length ? (
        <div className="mt-3 flex flex-wrap justify-center gap-2">
          {resources.map((resource) => (
            <span
              key={`${speaker.name}-${resource}`}
              className="rounded-md border-2 border-gray-light bg-white px-3 py-1 text-xs font-semibold text-secondary-dark"
            >
              {resource}
            </span>
          ))}
        </div>
      ) : null}
    </div>
  );
}

function MeetingSection({ meeting }) {
  const mediaImages = meeting.media?.images ?? [];
  const mediaVideos = meeting.media?.videos ?? [];
  const [imageIndex, setImageIndex] = useState(0);
  const isBhubaneswar = meeting.id === "bhubaneshwar-2024";
  const isBilbao = meeting.id === "bilbao-2018";
  const isCali = meeting.id === "cali-2019";
  const mainProgramLines = meeting.mainProgram?.text ?? [];
  const mainProgramSchedule = meeting.mainProgram?.schedule ?? [];
  const hasMainProgramSchedule = mainProgramSchedule.length > 0;
  const mainProgramSections = meeting.mainProgram?.sections ?? [];
  const hasMainProgramSections = mainProgramSections.length > 0;
  const scheduleToneStyles = {
    break: "bg-primary-extralight text-secondary-dark font-semibold",
    default: "bg-white text-gray-dark/80",
  };

  useEffect(() => {
    setImageIndex(0);
  }, [meeting.id]);

  useEffect(() => {
    if (mediaImages.length <= 1) {
      return undefined;
    }
    const intervalId = setInterval(() => {
      setImageIndex((prev) => (prev + 1) % mediaImages.length);
    }, 5000);
    return () => clearInterval(intervalId);
  }, [mediaImages.length, meeting.id]);

  const handleImageStep = (direction) => {
    if (mediaImages.length <= 1) {
      return;
    }
    setImageIndex((prev) => (prev + direction + mediaImages.length) % mediaImages.length);
  };

  return (
    <section id={meeting.id} className="mt-6">
      <div className="rounded-md border-2 border-gray-light bg-white p-4 shadow-sm">
        <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr] items-center">
          <div>
            <div className="text-xs font-semibold text-secondary-dark">IAJES International Meeting</div>
            <h3 className="mt-2">{meeting.title}</h3>
            {meeting.intro ? (
              <p className="mt-3 text-sm text-gray-dark/80">{meeting.intro}</p>
            ) : null}
            {meeting.date || meeting.location ? (
              <div className="mt-4 rounded-md border-2 border-gray-light bg-primary-extralight px-4 py-3 text-sm text-gray-dark/80">
                <div className="grid gap-3 sm:grid-cols-2">
                  {meeting.date ? (
                    <div>
                      <div className="text-xs font-semibold text-secondary-dark">Date</div>
                      <div className="mt-1">{meeting.date}</div>
                    </div>
                  ) : null}
                  {meeting.location ? (
                    <div>
                      <div className="text-xs font-semibold text-secondary-dark">Location</div>
                      <div className="mt-1">{meeting.location}</div>
                    </div>
                  ) : null}
                </div>
              </div>
            ) : null}
            <div className="mt-4 text-sm text-gray-dark/70">
              All meeting details are included below.
            </div>
          </div>
          <div className="rounded-md border-2 border-gray-light bg-white overflow-hidden">
            <img
              src={meeting.heroImage}
              alt={meeting.title}
              className="h-64 w-full object-cover lg:h-full"
              loading="lazy"
            />
          </div>
        </div>
      </div>

      <div className="mt-6 flex flex-col gap-4">
        {!isBilbao ? (
          <SectionDropdown title="A milestone event">
            {isCali ? (
              <div className="flex flex-col gap-3">
                {CALI_MILESTONE_SECTIONS.map((section, index) => {
                  const hasDetails = section.details.length > 0 || (section.subsections?.length ?? 0) > 0;

                  if (!hasDetails) {
                    return (
                      <div
                        key={`${meeting.id}-milestone-section-${index}`}
                        className="rounded-md border-2 border-gray-light bg-primary-extralight px-4 py-3 text-sm font-semibold text-secondary-dark"
                      >
                        {section.title}
                      </div>
                    );
                  }

                  return (
                    <details
                      key={`${meeting.id}-milestone-section-${index}`}
                      className="rounded-md border-2 border-gray-light bg-white"
                    >
                      <summary className="list-none">
                        <div className="flex items-center justify-between gap-4 rounded-md bg-primary-extralight px-4 py-3">
                          <span className="font-semibold text-secondary-dark">{section.title}</span>
                          <i className="bi bi-chevron-down text-secondary-dark" aria-hidden="true" />
                        </div>
                      </summary>
                      <div className="border-t-2 border-gray-light p-4">
                        <div className="flex flex-col gap-3">
                          {section.details.map((detail, detailIndex) => (
                            <p
                              key={`${meeting.id}-milestone-${index}-${detailIndex}`}
                              className="text-sm text-gray-dark/80"
                            >
                              {detail}
                            </p>
                          ))}
                          {section.subsections?.length ? (
                            <div className="mt-3 flex flex-col gap-3">
                              {section.subsections.map((subsection, subIndex) => (
                                <div
                                  key={`${meeting.id}-milestone-sub-${index}-${subIndex}`}
                                  className="border-l-2 border-gray-light pl-3"
                                >
                                  <div className="text-sm font-semibold text-secondary-dark">
                                    {subsection.title}
                                  </div>
                                  {subsection.details?.length ? (
                                    <div className="mt-2 flex flex-col gap-2">
                                      {subsection.details.map((subDetail, subDetailIndex) => (
                                        <p
                                          key={`${meeting.id}-milestone-sub-${index}-${subIndex}-${subDetailIndex}`}
                                          className="text-sm text-gray-dark/80"
                                        >
                                          {subDetail}
                                        </p>
                                      ))}
                                    </div>
                                  ) : null}
                                </div>
                              ))}
                            </div>
                          ) : null}
                        </div>
                      </div>
                    </details>
                  );
                })}
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {meeting.milestone.map((line, index) => (
                  <p key={`${meeting.id}-milestone-${index}`} className="text-sm text-gray-dark/80">
                    {line}
                  </p>
                ))}
              </div>
            )}
          </SectionDropdown>
        ) : null}

        <SectionDropdown title={isCali ? "List of participants" : "Main Program"}>
          {hasMainProgramSections ? (
            <div className="flex flex-col gap-6">
              {mainProgramSections.map((section, index) => {
                const columnClass =
                  section.columns === 2 ? "md:grid-cols-2" : "md:grid-cols-2 lg:grid-cols-3";

                return (
                  <div key={`${meeting.id}-program-section-${index}`}>
                    <div className="rounded-md border-2 border-gray-light bg-primary-extralight px-4 py-3 text-center">
                      <h4 className="text-secondary-dark">{section.title}</h4>
                      {section.description ? (
                        <p className="mt-2 text-sm text-gray-dark/80">{section.description}</p>
                      ) : null}
                    </div>
                    <div className={`mt-4 grid gap-4 ${columnClass}`}>
                      {section.speakers.map((speaker, speakerIndex) => (
                        <SpeakerCard
                          key={`${meeting.id}-program-section-${index}-${speakerIndex}`}
                          speaker={speaker}
                        />
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : isBhubaneswar && mainProgramLines.length ? (
            <div className="grid gap-4 lg:grid-cols-2 lg:items-start">
              <div className="rounded-md border-2 border-gray-light bg-primary-extralight px-4 py-3 text-sm font-semibold text-secondary-dark">
                {mainProgramLines[0]}
              </div>
              <div className="rounded-md border-2 border-gray-light bg-white px-4 py-3">
                <div className="text-lg font-semibold text-secondary-dark">
                  {mainProgramLines[1] || "Program details"}
                </div>
                {mainProgramLines[2] ? (
                  <p className="mt-2 text-sm text-gray-dark/80">{mainProgramLines[2]}</p>
                ) : null}
              </div>
            </div>
          ) : meeting.mainProgram?.text?.length ? (
            <div className="flex flex-col gap-3">
              {meeting.mainProgram.text.map((line, index) => (
                <p key={`${meeting.id}-program-${index}`} className="text-sm text-gray-dark/80">
                  {line}
                </p>
              ))}
            </div>
          ) : null}

          {hasMainProgramSchedule ? (
            <div className="mt-4 overflow-hidden rounded-md border-2 border-gray-light bg-white">
              <div className="border-b-2 border-gray-light bg-primary-extralight px-4 py-2 text-sm font-semibold text-secondary-dark">
                Program schedule
              </div>
              <div className="grid gap-4 p-4 md:grid-cols-2 xl:grid-cols-4">
                {mainProgramSchedule.map((day) => (
                  <div
                    key={`${meeting.id}-schedule-${day.day}`}
                    className="flex h-full flex-col overflow-hidden rounded-md border-2 border-gray-light bg-white"
                  >
                    <div className="bg-secondary-dark px-3 py-2 text-xs font-semibold text-white">
                      {day.day}
                    </div>
                    {day.theme ? (
                      <div className="border-b-2 border-gray-light bg-secondary-light px-3 py-1 text-xs font-semibold text-white">
                        {day.theme}
                      </div>
                    ) : null}
                    <div className="flex flex-1 flex-col gap-3 p-3">
                      {day.items.map((item, index) => {
                        const isObject = typeof item === "object";
                        const title = isObject ? item.title : item;
                        const subitems = isObject ? item.subitems : null;
                        const tone = isObject && item.tone ? item.tone : "default";
                        const toneClass = scheduleToneStyles[tone] || scheduleToneStyles.default;

                        return (
                          <div
                            key={`${meeting.id}-schedule-${day.day}-${index}`}
                            className={`rounded-md border-2 border-gray-light px-3 py-2 text-xs ${toneClass}`}
                          >
                            <div>{title}</div>
                            {subitems?.length ? (
                              <div className="mt-2 flex flex-col gap-1 text-xs text-gray-dark/70">
                                {subitems.map((subitem, subIndex) => (
                                  <div key={`${meeting.id}-schedule-${day.day}-${index}-${subIndex}`}>
                                    - {subitem}
                                  </div>
                                ))}
                              </div>
                            ) : null}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : null}

          {meeting.mainProgram?.embed ? (
            <div className="mt-4 overflow-hidden rounded-md border-2 border-gray-light bg-white">
              <iframe
                title={`${meeting.title} main program`}
                src={meeting.mainProgram.embed}
                className="h-[420px] w-full"
                allowFullScreen
              />
            </div>
          ) : null}

          {meeting.mainProgram?.image && !hasMainProgramSchedule && !hasMainProgramSections ? (
            <div className="mt-4 overflow-hidden rounded-md border-2 border-gray-light bg-white">
              <div className="border-b-2 border-gray-light bg-primary-extralight px-4 py-2 text-sm font-semibold text-secondary-dark">
                Program schedule
              </div>
              <div className="bg-white p-3">
                <img
                  src={meeting.mainProgram.image}
                  alt={`${meeting.title} main program`}
                  className="h-auto w-full object-contain"
                  loading="lazy"
                />
              </div>
            </div>
          ) : null}

          {meeting.mainProgram?.topics ? (
            <div className="mt-4 flex flex-col gap-2">
              {meeting.mainProgram.topics.map((line, index) => (
                <p key={`${meeting.id}-topics-${index}`} className="text-sm text-gray-dark/80">
                  {line}
                </p>
              ))}
            </div>
          ) : null}

        </SectionDropdown>

        {meeting.attendees?.embed ? (
          <SectionDropdown title="List of attendees">
            <div className="overflow-hidden rounded-md border-2 border-gray-light bg-white">
              <iframe
                title={`${meeting.title} attendees`}
                src={meeting.attendees.embed}
                className="h-[520px] w-full"
                allowFullScreen
              />
            </div>
          </SectionDropdown>
        ) : null}

        {meeting.preConference ? (
          <SectionDropdown title={meeting.preConference.title}>
            <div className="flex flex-col gap-3">
              {meeting.preConference.items.map((line, index) => (
                <p key={`${meeting.id}-preconf-${index}`} className="text-sm text-gray-dark/80">
                  {line}
                </p>
              ))}
            </div>
            {meeting.preConference.images?.length ? (
              <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {meeting.preConference.images.map((src, index) => (
                  <div
                    key={`${meeting.id}-preconf-image-${index}`}
                    className="overflow-hidden rounded-md border-2 border-gray-light bg-white"
                  >
                    <img
                      src={src}
                      alt={`${meeting.title} pre-conference ${index + 1}`}
                      className="h-full w-full object-cover"
                      loading="lazy"
                    />
                  </div>
                ))}
              </div>
            ) : null}
          </SectionDropdown>
        ) : null}

        <SectionDropdown title="Videos and Pictures">
          <div className="flex flex-col gap-4">
            {mediaVideos.length ? (
              <div>
                <div className="flex items-center gap-3">
                  <h4 className="text-secondary-dark">Videos</h4>
                  <div className="flex-1 border-b-2 border-gray-light" />
                </div>
                <div className="mt-3 grid gap-4 lg:grid-cols-2">
                  {mediaVideos.map((src, index) => (
                    <div
                      key={`${meeting.id}-video-${index}`}
                      className="overflow-hidden rounded-md border-2 border-gray-light bg-white"
                    >
                      <div className="relative w-full bg-black pt-[56.25%]">
                        <iframe
                          title={`${meeting.title} video ${index + 1}`}
                          src={src}
                          className="absolute inset-0 h-full w-full"
                          allowFullScreen
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}

            {mediaImages.length ? (
              <div className="mt-2">
                <div className="flex items-center gap-3">
                  <h4 className="text-secondary-dark">Photos</h4>
                  <div className="flex-1 border-b-2 border-gray-light" />
                </div>
                <div className="mt-3 overflow-hidden rounded-md border-2 border-gray-light bg-white p-3">
                  <div className="relative flex items-center justify-center overflow-hidden rounded-md bg-white p-3">
                    <img
                      src={mediaImages[imageIndex]}
                      alt={`${meeting.title} photo ${imageIndex + 1}`}
                      className="h-[360px] w-full object-contain"
                      loading="lazy"
                    />
                    {mediaImages.length > 1 ? (
                      <>
                        <button
                          type="button"
                          className="button button-light absolute left-3 top-1/2 -translate-y-1/2"
                          onClick={() => handleImageStep(-1)}
                          aria-label="Previous photo"
                        >
                          <i className="bi bi-chevron-left" aria-hidden="true" />
                        </button>
                        <button
                          type="button"
                          className="button button-light absolute right-3 top-1/2 -translate-y-1/2"
                          onClick={() => handleImageStep(1)}
                          aria-label="Next photo"
                        >
                          <i className="bi bi-chevron-right" aria-hidden="true" />
                        </button>
                      </>
                    ) : null}
                  </div>
                  <div className="mt-3 text-xs text-gray-dark/70">
                    Photo {imageIndex + 1} of {mediaImages.length}
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        </SectionDropdown>
      </div>
    </section>
  );
}

export default function InternationalMeetings() {
  const [selectedMeetingId, setSelectedMeetingId] = useState(PREVIOUS_MEETINGS[0]?.id ?? "");
  const selectedMeeting = PREVIOUS_MEETINGS.find((meeting) => meeting.id === selectedMeetingId);

  return (
    <div className="min-h-screen bg-white">
      <Menu />
      <div className="lg:px-40 px-20 py-20 duration-200">
        <h1>IAJES international meetings</h1>

        <p className="mt-3 text-sm text-gray-dark/70">
          Explore milestone events, programs, and media from each international meeting.
        </p>

        <section className="mt-8 grid gap-8 lg:grid-cols-[280px_1fr]">
          <aside className="rounded-md border-2 border-gray-light bg-white p-4 shadow-sm lg:sticky lg:top-24 h-fit">
            <div className="text-sm font-semibold text-secondary-dark">Meetings</div>
            <div className="mt-3 lg:hidden">
              <label htmlFor="meeting-select" className="text-sm font-semibold text-secondary-dark">
                Choose a meeting
              </label>
              <select
                id="meeting-select"
                className="input input-text w-full mt-2"
                value={selectedMeetingId}
                onChange={(event) => setSelectedMeetingId(event.target.value)}
              >
                {PREVIOUS_MEETINGS.map((meeting) => (
                  <option key={meeting.id} value={meeting.id}>
                    {meeting.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="mt-4 hidden lg:flex flex-col gap-2">
              {PREVIOUS_MEETINGS.map((meeting) => {
                const isActive = meeting.id === selectedMeetingId;
                return (
                  <button
                    key={meeting.id}
                    type="button"
                    className={`${
                      isActive ? "button" : "button button-light"
                    } w-full text-left flex items-center gap-3`}
                    onClick={() => setSelectedMeetingId(meeting.id)}
                    aria-pressed={isActive}
                  >
                    <div className="h-12 w-12 overflow-hidden rounded-md border-2 border-gray-light bg-white shrink-0">
                      <img
                        src={meeting.heroImage}
                        alt={meeting.label}
                        className="h-full w-full object-cover"
                        loading="lazy"
                      />
                    </div>
                    <span className="text-sm font-semibold">{meeting.label}</span>
                  </button>
                );
              })}
            </div>
          </aside>

          <div>
            <h2 className="mb-3">Previous Conferences</h2>
            {selectedMeeting ? <MeetingSection meeting={selectedMeeting} /> : null}
          </div>
        </section>

        <div className="mt-16 text-sm text-gray-dark/70">
          <p>IAJES works within the International Association of Jesuit Universities</p>
          <p>and in deep synergy with the Regional Associations of Jesuit Universities</p>
        </div>
      </div>
    </div>
  );
}
