export const stripHtml = (html: string) => {
  const startOfMessage = html.indexOf("<div");
  const endOfMessage = html.indexOf('<div id="appendonsend"></div>\r\n');
  const message = html.substring(startOfMessage, endOfMessage);
  const doc = new DOMParser().parseFromString(message, "text/html");
  return (doc.body.textContent || "").trim();
};

const arrayHandler = (messageArray: string[], contains: string) => {
  let indexOfContains;
  messageArray.some((element, index) => {
    if (element.includes(contains)) {
      indexOfContains = index;
      return index;
    }
  });
  const resArray = messageArray.slice(0, Number(indexOfContains) - 1);
  return resArray.join("\n").trim();
};

export const stripText = (text: string) => {
  const libertyContains = text.indexOf("LibertyMeets service");
  const protonContains = text.indexOf("Proton");

  if (libertyContains > -1) {
    if (text.includes("\r\n")) {
      const messageArray = text.split("\r\n");
      return arrayHandler(messageArray, "LibertyMeets service");
    } else {
      const messageArray = text.split("\n");
      return arrayHandler(messageArray, "LibertyMeets service");
    }
  } else if (protonContains > -1) {
    if (text.includes("\r\n")) {
      const messageArray = text.split("\r\n");
      return arrayHandler(messageArray, "Proton");
    } else {
      const messageArray = text.split("\n");
      return arrayHandler(messageArray, "Proton");
    }
  } else {
    const messageArray = text.split("\r\n");
    return messageArray.join("\n").trim();
  }
};

describe("stripHtml", () => {
  it("parses", async () => {
    const input =
      "<html>\r\n" +
      "<head>\r\n" +
      '<meta http-equiv="Content-Type" content="text/html; charset=koi8-r">\r\n' +
      '<style type="text/css" style="display:none;"> P {margin-top:0;margin-bottom:0;} </style>\r\n' +
      "</head>\r\n" +
      '<body dir="ltr">\r\n' +
      '<div style="font-family: Calibri, Arial, Helvetica, sans-serif; font-size: 12pt; color: rgb(0, 0, 0); background-color: rgb(255, 255, 255);" class="elementToProof">\r\n' +
      "hello AP #2, nice to get this message!</div>\r\n" +
      '<div style="font-family: Calibri, Arial, Helvetica, sans-serif; font-size: 12pt; color: rgb(0, 0, 0); background-color: rgb(255, 255, 255);" class="elementToProof">\r\n' +
      "let me know when you receive it</div>\r\n" +
      '<div style="font-family: Calibri, Arial, Helvetica, sans-serif; font-size: 12pt; color: rgb(0, 0, 0); background-color: rgb(255, 255, 255);" class="elementToProof">\r\n' +
      "have a good day!</div>\r\n" +
      '<div id="appendonsend"></div>\r\n' +
      '<hr style="display:inline-block;width:98%" tabindex="-1">\r\n' +
      '<div id="divRplyFwdMsg" dir="ltr"><font face="Calibri, sans-serif" style="font-size:11pt" color="#000000"><b>От:</b> service@mg.twelvedevs.com &lt;service@mg.twelvedevs.com&gt; от имени LibertyMeets service &lt;service@mg.twelvedevs.com&gt;<br>\r\n' +
      "<b>Отправлено:</b> 25 января 2023 г. 12:29<br>\r\n" +
      "<b>Кому:</b> Vadim Burdylev &lt;vburdylev@twelvedevs.com&gt;<br>\r\n" +
      "<b>Тема:</b> Some user send message</font>\r\n" +
      "<div></div>\r\n" +
      "</div>\r\n" +
      "<div>test message by AP #2 </div>\r\n" +
      "</body>\r\n" +
      "</html>\r\n";
    const expected = `hello AP #2, nice to get this message!

let me know when you receive it

have a good day!`;
    const result = stripHtml(input);
    expect(result).toBe(expected);
  });
});

describe("stripText - 1", () => {
  it("parses", async () => {
    const input =
      "sfasf asf \n" +
      " \n" +
      "fasfs \n" +
      " \n" +
      " \n" +
      " \n" +
      ' Sent: Tuesday, February 07, 2023 at 4:51 PM From: "LibertyMeets service" <service@mg.libertymeets.com> To: 12devs@gmx.com Subject: Some user send message \n' +
      "Влшвлатевшшвл \n" +
      "Швщкщкщ \n" +
      "вт, 7 февр. 2023 г., 16:50 LibertyMeets service";
    const expected = `sfasf asf 
 
fasfs`;
    const result = stripText(input);
    expect(result).toBe(expected);
  });
});

describe("stripText - 2", () => {
  it("parses", async () => {
    const input2 =
      "Вшвдоа\r\n" +
      "Вгшао\r\n" +
      "\r\n" +
      "\r\n" +
      "вт, 7 февр. 2023 г., 16:48 LibertyMeets service <service@mg.libertymeets.com";
    const expected2 = `Вшвдоа
Вгшао`;
    const result2 = stripText(input2);
    expect(result2).toBe(expected2);
  });
});

describe("stripText - 3", () => {
  it("parses", async () => {
    const input3 =
      "Были гуси!\r\n" +
      "бла\r\n" +
      "\r\n" +
      "    вторник, 7 февраля 2023 г., 12:32:21 GMT+3, LibertyMeets service <service@mg.libertymeets.com> написал(-а):  \r\n" +
      " \r\n" +
      " ,fkfksdfls \r\n" +
      " \r\n" +
      " \r\n" +
      " \r\n" +
      ' Sent: Tuesday, February 07, 2023 at 12:31 PM From: "LibertyMeets service" To: 12devs@gmx.com Subject: Some user send message \r\n' +
      "Your reply has been sent to Post authorнгшн7шеш";
    const expected3 = `Были гуси!
бла`;
    const result3 = stripText(input3);
    expect(result3).toBe(expected3);
  });
});

describe("stripText - 4", () => {
  it("parses", async () => {
    const input4 =
      "второй белый\r\n" +
      "\r\n" +
      "\r\n" +
      "вт, 7 февр. 2023 г. в 12:10, LibertyMeets service <\r\n" +
      "service@mg.libertymeets.com>:";

    const expected4 = `второй белый`;
    const result4 = stripText(input4);
    expect(result4).toBe(expected4);
  });
});

describe("stripText - 5", () => {
  it("parses", async () => {
    const input5 =
      "один серый\n" +
      " \n" +
      "второй\n" +
      "\n" +
      "Отправлено с помощью [Proton Mail](https://proton.me/) защищенной почты.";

    const expected5 = `один серый
 
второй`;
    const result5 = stripText(input5);
    expect(result5).toBe(expected5);
  });
});

describe("stripText - 6", () => {
  it("parses", async () => {
    const input6 =
      "И ещё один\n" +
      "\n" +
      "Опять\n" +
      "\n" +
      "Отправлено с телефона \n" +
      "\n" +
      "-------- Исходное сообщение -------- \n" +
      "От: LibertyMeets service <service@mg.libertymeets.com> \n" +
      "Дата: вт, 7 февр. 2023 г., 12:03 \n" +
      "Кому: babton1234@gmail.com \n" +
      "Тема: Some user send message \n" +
      "ещ один ответ \n" +
      " \n" +
      " \n" +
      " \n" +
      'Sent: Tuesday, February 07, 2023 at 12:02 PM From: "LibertyMeets service"  To: 12devs@gmx.com Subject: Some user send message \n' +
      "Вторая попытка \n" +
      "Отправлено с телефона \n" +
      "-------- Исходное сообщение -------- \n" +
      "От: LibertyMeets service \n" +
      "Дата: вт, 7 февр. 2023 г., 12:00 \n" +
      "Кому: babton1234@gmail.com \n" +
      "Тема: Some user send message \n" +
      "Ответ на ответ с GMX \n" +
      'Sent: Tuesday, February 07, 2023 at 11:58 AM From: "LibertyMeets service" To: 12devs@gmx.com Subject: Some user send message \n' +
      "Ответ с GMAIL \n" +
      "Отправлено с телефона \n" +
      "-------- Исходное сообщение -------- \n" +
      "От: LibertyMeets service \n" +
      "Дата: вт, 7 февр. 2023 г., 11:53 \n" +
      "Кому: babton1234@gmail.com \n" +
      "Тема: Some user send message \n" +
      "reply from GMX to 2 post";

    const expected6 = `И ещё один

Опять`;
    const result6 = stripText(input6);
    expect(result6).toBe(expected6);
  });
});

describe("stripText - 7", () => {
  it("parses", async () => {
    const input7 =
      "ещ один ответ \n" +
      " \n" +
      " \n" +
      " \n" +
      ' Sent: Tuesday, February 07, 2023 at 12:02 PM From: "LibertyMeets service" <service@mg.libertymeets.com> To: 12devs@gmx.com Subject: Some user send message \n' +
      "Вторая попытка \n" +
      "Отправлено с телефона \n" +
      "-------- Исходное сообщение -------- \n" +
      "От: LibertyMeets service \n" +
      "Дата: вт, 7 февр. 2023 г., 12:00 \n" +
      "Кому: babton1234@gmail.com \n" +
      "Тема: Some user send message \n" +
      "Ответ на ответ с GMX \n" +
      'Sent: Tuesday, February 07, 2023 at 11:58 AM From: "LibertyMeets service" To: 12devs@gmx.com Subject: Some user send message \n' +
      "Ответ с GMAIL \n" +
      "Отправлено с телефона \n" +
      "-------- Исходное сообщение -------- \n" +
      "От: LibertyMeets service \n" +
      "Дата: вт, 7 февр. 2023 г., 11:53 \n" +
      "Кому: babton1234@gmail.com \n" +
      "Тема: Some user send message \n" +
      "reply from GMX to 2 post";

    const expected7 = `ещ один ответ`;
    const result7 = stripText(input7);
    expect(result7).toBe(expected7);
  });
});

describe("stripText - 8", () => {
  it("parses", async () => {
    const input8 =
      "Sure. A group of us are hosting a watch party in the Heights at 5p\r\n" +
      "\r\n" +
      "yes\r\n";

    const expected8 = `Sure. A group of us are hosting a watch party in the Heights at 5p

yes`;
    const result8 = stripText(input8);
    expect(result8).toBe(expected8);
  });
});
