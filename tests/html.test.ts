import { stripHtml } from "../utils/html";


describe("stripHtml", () => {
  it("parses", async () => {
    const input = '<html>\r\n' +
    '<head>\r\n' +
    '<meta http-equiv="Content-Type" content="text/html; charset=koi8-r">\r\n' +
    '<style type="text/css" style="display:none;"> P {margin-top:0;margin-bottom:0;} </style>\r\n' +
    '</head>\r\n' +
    '<body dir="ltr">\r\n' +
    '<div style="font-family: Calibri, Arial, Helvetica, sans-serif; font-size: 12pt; color: rgb(0, 0, 0); background-color: rgb(255, 255, 255);" class="elementToProof">\r\n' +
    'hello AP #2, nice to get this message!</div>\r\n' +
    '<div style="font-family: Calibri, Arial, Helvetica, sans-serif; font-size: 12pt; color: rgb(0, 0, 0); background-color: rgb(255, 255, 255);" class="elementToProof">\r\n' +
    'let me know when you receive it</div>\r\n' +
    '<div style="font-family: Calibri, Arial, Helvetica, sans-serif; font-size: 12pt; color: rgb(0, 0, 0); background-color: rgb(255, 255, 255);" class="elementToProof">\r\n' +
    'have a good day!</div>\r\n' +
    '<div id="appendonsend"></div>\r\n' +
    '<hr style="display:inline-block;width:98%" tabindex="-1">\r\n' +
    '<div id="divRplyFwdMsg" dir="ltr"><font face="Calibri, sans-serif" style="font-size:11pt" color="#000000"><b>От:</b> service@mg.twelvedevs.com &lt;service@mg.twelvedevs.com&gt; от имени LibertyMeets service &lt;service@mg.twelvedevs.com&gt;<br>\r\n' +
    '<b>Отправлено:</b> 25 января 2023 г. 12:29<br>\r\n' +
    '<b>Кому:</b> Vadim Burdylev &lt;vburdylev@twelvedevs.com&gt;<br>\r\n' +
    '<b>Тема:</b> Some user send message</font>\r\n' +
    '<div></div>\r\n' +
    '</div>\r\n' +
    '<div>test message by AP #2 </div>\r\n' +
    '</body>\r\n' +
    '</html>\r\n';
    const expected = `hello AP #2, nice to get this message!

let me know when you receive it

have a good day!


От: service@mg.twelvedevs.com <service@mg.twelvedevs.com> от имени LibertyMeets service <service@mg.twelvedevs.com>
Отправлено: 25 января 2023 г. 12:29
Кому: Vadim Burdylev <vburdylev@twelvedevs.com>
Тема: Some user send message


test message by AP #2`;
    const result = stripHtml(input);
    expect(result).toBe(expected);
  });
});
