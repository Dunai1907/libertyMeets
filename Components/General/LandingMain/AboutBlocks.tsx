import AboutBlock from "./AboutBlock";

const blocksInfo = [
  {
    title: "Purpose",
    img: { src: "decor/Icon 1.svg", width: 147, height: 150 },
    lines: [
      {
        isMarked: true,
        text: "A trusted platform to connect freedom-minded people",
      },
      {
        isMarked: true,
        text: "Facilitate strong local communities and work environments",
      },
      {
        isMarked: true,
        text: "Allow volunteers/donors to connect directly with campaigns",
      },
      {
        isMarked: true,
        text: "Enhance the liberty movement's social, political, and economic influence",
      },
    ],
  },
  {
    title: "Benefits",
    img: { src: "decor/Icon 2.svg", width: 145, height: 144 },
    lines: [
      { isMarked: true, text: "Access to audience who shares your values" },
      { isMarked: true, text: "Easy and free to use" },
      {
        isMarked: true,
        text: "Like Craigslist, your communications are anonymous",
      },
      { isMarked: true, text: "Focused on maintaining your privacy" },
    ],
  },
  {
    title: "How it works",
    img: { src: "decor/Icon 3.svg", width: 135, height: 150 },
    lines: [
      {
        isMarked: false,
        text: "Search and Post opportunities in four categories:",
      },
      { isMarked: true, text: "Social (meet like-minded people)" },
      {
        isMarked: true,
        text: "Volunteer (easily find ways to turn passion into action)",
      },
      {
        isMarked: true,
        text: "Professional (connect employers and employees on the same page)",
      },
      {
        isMarked: true,
        text: "Campaigns (bypass GOP/RNC control of resources)",
      },
    ],
  },
];

export default function AboutBlocks() {
  return (
    <>
      {blocksInfo.map((item, i) => (
        <AboutBlock title={item.title} img={item.img} lines={item.lines} key={i} />
      ))}
    </>
  );
}
