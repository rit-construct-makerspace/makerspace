const reservations = {
  pending: [
    {
      id: 1,
      maker: {
        id: 1,
        name: "Janice Smith",
        image:
          "https://t4.ftcdn.net/jpg/03/83/25/83/240_F_383258331_D8imaEMl8Q3lf7EKU2Pi78Cn0R7KkW9o.jpg",
        role: "Mentor",
      },
      equipment: {
        id: 2,
        name: "Table Saw Thing",
        image:
          "https://cdn.discordapp.com/attachments/1176296914556309539/1176297174041112766/laser-engraver-for-metal.jpg?ex=656e5b1c&is=655be61c&hm=033e2b1153b169a231e5cb72352e7b44b7ee568bc02d3b260319c1ed02f94f3a&",
      },
      startTime: "2022-02-12T15:00:00Z",
      endTime: "2022-02-12T16:30:00Z",
      comment:
        "Hello I need help with this machine I don't want to chop off my fingers thank you.",
      attachments: [
        {
          name: "legitimate_file.exe",
          url: "",
        },
        {
          name: "not_a_virus.jpg",
          url: "",
        },
      ],
    },
  ],
  confirmed: [],
  all: [],
};

export default reservations;
