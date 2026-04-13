import { useEffect, useState } from "react";
import { Menu } from "../components/menu";
import internationalMeetingTemplate from "../templates/international-meeting-template";

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
        resources: [
          {
            label: "Slides",
            href: "https://drive.google.com/open?id=0B2UIkFIjmCEsRE9lNDcyS0JIUnEzM3Z6dkQ2R0U1Y1Fja0dB",
          },
        ],
      },
      {
        topic: "ENERGY",
        name: "Pablo Frias Marin",
        affiliation: "ICAI - Madrid - Spain",
        quote:
          "We have to put a lot of efforts to try to bring all the people deprived of access to the energy into the light.",
        resources: [
          {
            label: "Slides",
            href: "https://drive.google.com/open?id=0B2UIkFIjmCEsVGdnQm5fZ2xhdThUZ0tnOUdraWVRWEh3czh3",
          },
        ],
      },
      {
        topic: "BIG DATAS/FACTORY 4.0",
        name: "Alex Rayon Jerez",
        affiliation: "DEUSTO - Spain",
        quote:
          "The problem is not technology...We have to teach how technology can transform our societies using less resources.",
        resources: [],
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
        resources: [
          {
            label: "Slides",
            href: "https://drive.google.com/open?id=0B2UIkFIjmCEsOEJ3NTREQmFZWkR5X1ZfbDFVU2xYRVoxSGVn",
          },
          {
            label: "Video",
            href: "https://drive.google.com/open?id=1a2ESlTC_9U3fob6af4yG5pryP7Fa-azF",
          },
        ],
      },
      {
        topic: "\"Radiations and health\"",
        name: "Fr John Rose",
        affiliation: "Xavier Institute of Engineering Mumbai - India",
        quote:
          "We can show in India one, that Engineering school is not minded to make money alone and two, we can bring ethics in Engineering.",
        resources: [
          {
            label: "Paper",
            href: "https://drive.google.com/open?id=1_st51-SKi5SDfo4cpwRwp6BcOenJFZ0A",
          },
          {
            label: "Slides",
            href: "https://drive.google.com/open?id=1Mxbt5IAj-PcSsuDamy6y3QciOA2FcWYJ",
          },
          {
            label: "Video",
            href: "https://drive.google.com/open?id=1a2ESlTC_9U3fob6af4yG5pryP7Fa-azF",
          },
        ],
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
        resources: [
          {
            label: "Slides",
            href: "https://drive.google.com/open?id=0B2UIkFIjmCEsQm44cUo3dm85OFVLVVFIc0c5b1lMZHo4QXNV",
          },
          {
            label: "Video",
            href: "https://drive.google.com/open?id=1TFCOxXotISwePph08F9LBYjW9SOisQ7K",
          },
        ],
      },
      {
        topic: "Human development for future decision-makers",
        name: "Yann Ferguson",
        affiliation: "Icam",
        quote: "We have to reinvent our links to the planet putting more ecology into humanism.",
        resources: [
          {
            label: "Slides",
            href: "https://drive.google.com/open?id=1HfM10Kj5xc7TIMQmf2ns_zE6p35Q8JoL",
          },
          {
            label: "Video",
            href: "https://drive.google.com/open?id=1TFCOxXotISwePph08F9LBYjW9SOisQ7K",
          },
        ],
      },
      {
        topic: "Innovative pedagogy to mix Engineering and social justice",
        name: "Gail Baura",
        affiliation: "LUC - USA",
        quote:
          "With engineering environments changing we believe we must prepare our students for these environments ...so that (for example) if a request to falsify data occurs they have thought about it and they have a plan of action.",
        resources: [
          {
            label: "Slides",
            href: "https://drive.google.com/open?id=1PNtY_eqGBcZpV5qE_w6p26csam3_pWtj",
          },
          {
            label: "Video",
            href: "https://drive.google.com/open?id=1TFCOxXotISwePph08F9LBYjW9SOisQ7K",
          },
        ],
      },
      {
        topic: "\"Becoming an engineer within a Jesuit University : which specificities ?\"",
        name: "Fr. Jose Maria Guibert",
        affiliation: "Rector DEUSTO - Bilbao - Spain",
        quote:
          "From the greek origin, we inherited two models of institutions : university with the scientific and professional model which pushes the knowledge for its own sake and promotes successful professional life. And the humanistic school with the aim of training people in social responsibility and in effective communication skills. What defines our institution today?",
        resources: [
          {
            label: "Paper",
            href: "https://drive.google.com/open?id=1KS3NkL0I5tLQFWvu9hEdA98cXrq4ODuc",
          },
          {
            label: "Slides",
            href: "https://drive.google.com/open?id=1qeyJ27YWbVjGrA-KLM2mm-h3m7y2JXfW",
          },
          {
            label: "Video",
            href: "https://drive.google.com/open?id=1-AoDjl2d-VoK2TaCcPLk8SHaUCNpwCsi",
          },
        ],
      },
      {
        topic: "Engineers for a societal change",
        name: "Guillermo Dorronsoro",
        affiliation: "DEUSTO - Bilbao - Spain",
        quote:
          "What does it mean to be human? it will be more and more difficult to be different from machines.",
        quoteTwo:
          "A lot of changes are going to come: this is going to be a very complex moment of history ...but it's really important to be optimistic, to have hope in ourselves and society.",
        resources: [
          {
            label: "Slides",
            href: "https://drive.google.com/open?id=1ScaDe8XiRLqKCybXgzIx7KDPP_SGkt-P",
          },
          {
            label: "Video",
            href: "https://drive.google.com/open?id=1-AoDjl2d-VoK2TaCcPLk8SHaUCNpwCsi",
          },
        ],
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
        resources: [
          {
            label: "Slides",
            href: "https://drive.google.com/open?id=1yp1Dl23oyFWs3mzwk0L6owiAJOVk24IM",
          },
          {
            label: "Video",
            href: "https://drive.google.com/open?id=1e1y4dvEcQM5dMXsG7B4r6HYOzIvK7_M0",
          },
        ],
      },
      {
        topic: "Building Jesuit Networks - Ideas on success factors for Jesuit Networking",
        name: "Fr. Daniel Villanueva SJ",
        affiliation: "Director \"Entreculturas\"",
        role: "Expert on Jesuit Networking",
        quote:
          "We have to be very clear: what is the added value you are bringing into the table of the jesuit mission? are you bringing learning capabilities and adaptation to our mission, impact or scale.., explorability and innovation..., to which objectives of the higher education secretary are you contributing? to what extent you work ?",
        resources: [
          {
            label: "Paper",
            href: "https://drive.google.com/open?id=1Ms1Ey92A1peOhbIvvskemULX15H9nGXu",
          },
          {
            label: "Slides",
            href: "https://drive.google.com/open?id=1MKBD1i5fTpduf1PpGZKEzaR_4oNlsGnX",
          },
          {
            label: "Video",
            href: "https://drive.google.com/open?id=1DPGtEIsxP2goMENikpeDKnK3eyyFCfU8",
          },
        ],
      },
      {
        topic: "How to operate fruitful synergy between IAJU and IAJES?",
        name: "Fr. Michael Garanzini",
        affiliation: "Secretary for Jesuit Higher Education",
        quote:
          "When I was told that you wanted to form an association and that it would be difficult and so on and so forth..!! No, it's going to be easy because engineers are very collaborative by nature; they understand everything has to fit together and work together or nothing happens.",
        resources: [
          {
            label: "Video",
            href: "https://drive.google.com/open?id=1DPGtEIsxP2goMENikpeDKnK3eyyFCfU8",
          },
        ],
      },
    ],
  },
];

const imagePaths = (year, count) =>
  Array.from({ length: count }, (_, index) =>
    "/img/international-meetings/" + year + "/" + String(index + 1).padStart(3, "0") + ".jpg"
  );

const IMAGES_2024 = imagePaths("2024", 79);
const IMAGES_2022 = imagePaths("2022", 26);
const IMAGES_2019_ALL = imagePaths("2019", 50);
const IMAGES_2019_PRE = IMAGES_2019_ALL.slice(0, 4);
const IMAGES_2019 = IMAGES_2019_ALL.slice(4);
const IMAGES_2018 = imagePaths("2018", 10);

const HERO_2024 = IMAGES_2024[0];
const HERO_2022 = IMAGES_2022[0];
const HERO_2019 = IMAGES_2019_ALL[0];
const HERO_2018 = IMAGES_2018[0];

const PROGRAM_DOC_2019 = "https://docs.google.com/document/d/1bi9diq3QV25TPagewwh1akU6eK4hLm2k-AkC7zqMXuw/preview";
const VIDEO_2019 = "https://www.youtube.com/embed/A7UL3erRagc?embed_config=%7B%22enc%22:%22AXH1eznjGKsIqTG5IyxYQqbAYm-vqsXGZgXXL0mY8JwW1RDQRbCN-JeCOvglg1JUVteVNbAVluLimKvu75Cvhi5hfX_eJIocwc9KHq0ntnA8bMDgjX95TKewISptVtuVlQgc_6wKuCICidX97hZuGOZZJksrwjihUU1tH2foKIePtvno%22%7D&errorlinks=1";
const VIDEO_2024 = [
  "https://drive.google.com/file/d/10MHYm7u4xFFJUmEt3nfRaJtBhI214xnV/preview",
  "https://drive.google.com/file/d/1_pRj3J8f7iDs6Oe0zu88sjVEEwkEidcM/preview",
];
const VIDEO_2018 = [
  "https://drive.google.com/file/d/1a2ESlTC_9U3fob6af4yG5pryP7Fa-azF/preview",
  "https://drive.google.com/file/d/1TFCOxXotISwePph08F9LBYjW9SOisQ7K/preview",
  "https://drive.google.com/file/d/1-AoDjl2d-VoK2TaCcPLk8SHaUCNpwCsi/preview",
  "https://drive.google.com/file/d/1e1y4dvEcQM5dMXsG7B4r6HYOzIvK7_M0/preview",
  "https://drive.google.com/file/d/1DPGtEIsxP2goMENikpeDKnK3eyyFCfU8/preview",
];

const MILESTONE_2018_INTRO = MILESTONE_2018.slice(1, 4);
const MILESTONE_2019_BODY = MILESTONE_2019.slice(3);

function createUpcomingMeeting(config) {
  const label = config?.label?.trim() || "Upcoming Conference";
  const id = label
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "") || "upcoming-conference";
  const toTextList = (value) => {
    if (Array.isArray(value)) {
      return value
        .map((item) => (typeof item === "string" ? item.trim() : ""))
        .filter(Boolean);
    }
    if (typeof value === "string" && value.trim()) {
      return [value.trim()];
    }
    return [];
  };
  const toScheduleList = (value) => {
    if (!Array.isArray(value)) {
      return [];
    }

    return value.filter(
      (day) =>
        day &&
        typeof day.day === "string" &&
        day.day.trim() &&
        Array.isArray(day.items) &&
        day.items.length > 0
    );
  };
  const overview = toTextList(config?.overview);
  const programNotes = toTextList(config?.programNotes);

  return {
    id,
    label,
    title: config?.title?.trim() || label,
    date: config?.date?.trim(),
    location: config?.location?.trim(),
    meetingWebsite: config?.meetingWebsite?.trim(),
    heroImage: config?.heroImage?.trim() || HERO_2024,
    milestone: overview,
    mainProgram: {
      text: programNotes.length ? programNotes : ["Program details coming soon."],
      schedule: toScheduleList(config?.schedule),
    },
    media: {
      videos: toTextList(config?.videos),
      images: toTextList(config?.photos),
    },
  };
}

function hasUpcomingMeeting(config) {
  return Boolean(config?.label?.trim());
}

const UPCOMING_MEETINGS = hasUpcomingMeeting(internationalMeetingTemplate)
  ? [createUpcomingMeeting(internationalMeetingTemplate)]
  : [];

const ARCHIVE_MEETINGS = [
  {
    id: "bhubaneshwar-2024",
    label: "4th Conference - Bhubaneswar 2024",
    title: "4th Conference - Bhubaneswar 2024",
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
    label: "3rd Conference - Boston 2022",
    title: "3rd Conference - Boston 2022",
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
    label: "2nd Conference - Cali 2019",
    title: "2nd Conference - Cali 2019",
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
    label: "1st Conference - Bilbao 2018",
    title: "1st Conference - Bilbao 2018",
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
      videos: VIDEO_2018,
      images: IMAGES_2018,
    },
  },
];

const ALL_MEETINGS = [...UPCOMING_MEETINGS, ...ARCHIVE_MEETINGS];

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
          {resources.map((resource, index) => {
            const isResourceObject = typeof resource === "object" && resource !== null;
            const label = isResourceObject ? resource.label : resource;
            const href = isResourceObject ? resource.href : null;

            if (!label) {
              return null;
            }

            if (href) {
              return (
                <a
                  key={`${speaker.name}-${label}-${index}`}
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-md border-2 border-gray-light bg-white px-3 py-1 text-xs font-semibold text-secondary-dark duration-200 hover:bg-primary-extralight"
                >
                  {label}
                </a>
              );
            }

            return (
              <span
                key={`${speaker.name}-${label}-${index}`}
                className="rounded-md border-2 border-gray-light bg-white px-3 py-1 text-xs font-semibold text-secondary-dark"
              >
                {label}
              </span>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}

function MeetingSidebarButton({ meeting, active = false, first = false, last = false, onClick }) {
  const stateClasses = active
    ? "border-primary-dark bg-primary-dark"
    : "border-gray-light bg-white hover:bg-primary-extralight";
  const roundingClasses = `${first ? "rounded-t-md" : ""} ${last ? "rounded-b-md border-b-2" : ""}`;

  return (
    <a href="#conference-details" className="block">
      <button
        type="button"
        className={`w-full border-x-2 border-t-2 p-3 text-left duration-200 ${stateClasses} ${roundingClasses}`}
        onClick={onClick}
        aria-pressed={active}
      >
        <div className="flex items-center gap-3">
          <div
            className={`h-14 w-20 shrink-0 overflow-hidden rounded-md border-2 ${
              active ? "border-white/70" : "border-gray-light"
            } bg-white`}
          >
            <img
              src={meeting.heroImage}
              alt={meeting.label}
              className="h-full w-full object-cover"
              loading="lazy"
            />
          </div>

          <div className="min-w-0 flex-1">
            <p className={`mb-0 font-semibold ${active ? "text-white" : "text-secondary-dark"}`}>
              {meeting.label}
            </p>
            {meeting.date ? (
              <p className={`mb-0 ${active ? "text-white/80" : "text-disabled-light"}`}>
                <i>{meeting.date}</i>
              </p>
            ) : null}
          </div>

          <i
            className={`bi bi-chevron-double-right shrink-0 ${
              active ? "text-white" : "text-primary-dark"
            }`}
            style={{ fontSize: "1.2rem" }}
            aria-hidden="true"
          />
        </div>
      </button>
    </a>
  );
}

function MeetingSection({ meeting }) {
  const mediaImages = meeting.media?.images ?? [];
  const mediaVideos = meeting.media?.videos ?? [];
  const [imageIndex, setImageIndex] = useState(0);
  const isBhubaneswar = meeting.id === "bhubaneshwar-2024";
  const isBilbao = meeting.id === "bilbao-2018";
  const isCali = meeting.id === "cali-2019";
  const milestoneLines = meeting.milestone ?? [];
  const mainProgramLines = meeting.mainProgram?.text ?? [];
  const mainProgramSchedule = meeting.mainProgram?.schedule ?? [];
  const hasMainProgramSchedule = mainProgramSchedule.length > 0;
  const mainProgramSections = meeting.mainProgram?.sections ?? [];
  const hasMainProgramSections = mainProgramSections.length > 0;
  const scheduleToneStyles = {
    break: {
      title: "font-semibold text-secondary-dark",
      subitem: "text-secondary-dark/80",
    },
    default: {
      title: "text-gray-dark/80",
      subitem: "text-gray-dark/70",
    },
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
            <div className="text-xs font-semibold text-secondary-dark">International meeting</div>
            <h3 className="mt-2">{meeting.title}</h3>
            {meeting.intro ? (
              <p className="mt-3 text-gray-dark/80">{meeting.intro}</p>
            ) : null}
            {meeting.date || meeting.location ? (
              <div className="mt-4 rounded-md border-2 border-gray-light bg-primary-extralight px-4 py-3 text-gray-dark/80">
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
            <div className="mt-4 text-gray-dark/70">
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
        {!isBilbao && milestoneLines.length ? (
          <SectionDropdown title="A milestone event">
            {isCali ? (
              <div className="flex flex-col gap-3">
                {CALI_MILESTONE_SECTIONS.map((section, index) => {
                  const hasDetails = section.details.length > 0 || (section.subsections?.length ?? 0) > 0;

                  if (!hasDetails) {
                    return (
                      <div
                        key={`${meeting.id}-milestone-section-${index}`}
                        className="rounded-md border-2 border-gray-light bg-primary-extralight px-4 py-3 font-semibold text-secondary-dark"
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
                              className="text-gray-dark/80"
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
                                          className="text-gray-dark/80"
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
                {milestoneLines.map((line, index) => (
                  <p key={`${meeting.id}-milestone-${index}`} className="text-gray-dark/80">
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
                        <p className="mt-2 text-gray-dark/80">{section.description}</p>
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
              <div className="rounded-md border-2 border-gray-light bg-primary-extralight px-4 py-3 font-semibold text-secondary-dark">
                {mainProgramLines[0]}
              </div>
              <div className="rounded-md border-2 border-gray-light bg-white px-4 py-3">
                <div className="text-lg font-semibold text-secondary-dark">
                  {mainProgramLines[1] || "Program details"}
                </div>
                {mainProgramLines[2] ? (
                  <p className="mt-2 text-gray-dark/80">{mainProgramLines[2]}</p>
                ) : null}
              </div>
            </div>
          ) : meeting.mainProgram?.text?.length ? (
            <div className="flex flex-col gap-3">
              {meeting.mainProgram.text.map((line, index) => (
                <p key={`${meeting.id}-program-${index}`} className="text-gray-dark/80">
                  {line}
                </p>
              ))}
            </div>
          ) : null}

          {hasMainProgramSchedule ? (
            <div className="mt-4 rounded-md bg-primary-extralight px-4 py-3">
              <div className="text-sm font-semibold text-secondary-dark">Program schedule</div>
              <div className="mt-3 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                {mainProgramSchedule.map((day) => (
                  <div key={`${meeting.id}-schedule-${day.day}`} className="border-l-2 border-secondary-light pl-3">
                    <p className="mb-0 font-semibold text-secondary-dark">{day.day}</p>
                    {day.theme ? (
                      <p className="mb-0 text-disabled-light">
                        <i>{day.theme}</i>
                      </p>
                    ) : null}
                    <div className="mt-2 flex flex-col gap-1.5">
                      {day.items.map((item, index) => {
                        const isObject = typeof item === "object";
                        const title = isObject ? item.title : item;
                        const subitems = isObject ? item.subitems : null;
                        const tone = isObject && item.tone ? item.tone : "default";
                        const toneStyle = scheduleToneStyles[tone] || scheduleToneStyles.default;

                        return (
                          <div key={`${meeting.id}-schedule-${day.day}-${index}`}>
                            <p className={`mb-0 ${toneStyle.title}`}>{title}</p>
                            {subitems?.length ? (
                              <div className="mt-0.5 flex flex-col gap-0.5 pl-2">
                                {subitems.map((subitem, subIndex) => (
                                  <p
                                    key={`${meeting.id}-schedule-${day.day}-${index}-${subIndex}`}
                                    className={`mb-0 ${toneStyle.subitem}`}
                                  >
                                    - {subitem}
                                  </p>
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
                <p key={`${meeting.id}-topics-${index}`} className="text-gray-dark/80">
                  {line}
                </p>
              ))}
            </div>
          ) : null}

        </SectionDropdown>

        {meeting.meetingWebsite ? (
          <SectionDropdown title="Meeting Website">
            <a
              href={meeting.meetingWebsite}
              target="_blank"
              rel="noreferrer"
              className="button inline-flex items-center"
            >
              Visit meeting website
              <i className="bi bi-arrow-up-right ml-2" aria-hidden="true" />
            </a>
            <p className="mt-3 text-gray-dark/70">{meeting.meetingWebsite}</p>
          </SectionDropdown>
        ) : null}

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
                <p key={`${meeting.id}-preconf-${index}`} className="text-gray-dark/80">
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
  const [selectedMeetingId, setSelectedMeetingId] = useState(ALL_MEETINGS[0]?.id ?? "");
  const selectedMeeting = ALL_MEETINGS.find((meeting) => meeting.id === selectedMeetingId) ?? null;

  const handleMeetingSelection = (meetingId) => {
    const nextMeeting = ALL_MEETINGS.find((meeting) => meeting.id === meetingId);
    if (!nextMeeting) {
      return;
    }

    setSelectedMeetingId(meetingId);
  };

  return (
    <div className="min-h-screen bg-white">
      <Menu />
      <div className="lg:px-40 px-10 py-20 duration-200">
        <h1>International meetings</h1>

        <p className="mt-3 text-gray-dark/70">
          Explore milestone events, programs, and media from each international meeting.
        </p>

        <section className="mt-8 grid gap-8 lg:grid-cols-[280px_1fr]">
          <aside className="h-fit lg:sticky lg:top-24">
            <h4 className="mb-3">Meetings</h4>
            <div className="mt-3 lg:hidden">
              <label htmlFor="meeting-select" className="font-semibold text-secondary-dark">
                Choose a meeting
              </label>
              <select
                id="meeting-select"
                className="input input-text w-full mt-2"
                value={selectedMeetingId}
                onChange={(event) => handleMeetingSelection(event.target.value)}
              >
                {ALL_MEETINGS.map((meeting) => (
                  <option key={meeting.id} value={meeting.id}>
                    {meeting.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="hidden lg:block">
              {ALL_MEETINGS.map((meeting, index) => (
                <MeetingSidebarButton
                  key={meeting.id}
                  meeting={meeting}
                  active={meeting.id === selectedMeetingId}
                  first={index === 0}
                  last={index === ALL_MEETINGS.length - 1}
                  onClick={() => handleMeetingSelection(meeting.id)}
                />
              ))}
            </div>
          </aside>

          <div id="conference-details">
            <h2 className="mb-3">Conferences</h2>
            {selectedMeeting ? <MeetingSection meeting={selectedMeeting} /> : null}
          </div>
        </section>

        <div className="mt-16 text-gray-dark/70">
          <p>IAJES works within the International Association of Jesuit Universities</p>
          <p>and in deep synergy with the Regional Associations of Jesuit Universities</p>
        </div>
      </div>
    </div>
  );
}
