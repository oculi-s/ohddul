import Market from "#/subIndex/MarketInfo";
import GroupInduty from "#/subIndex/GroupInduty";
import MajorShare from "#/subIndex/MajorShare";

import "@/module/array";
import { useEffect, useState } from "react";
import Fetcher from "@/module/fetcher";
import { TreeType } from "@/utils/type";

const N = 252;
const list = [
  "국민연금",
  "산업은행",
  "KB금융",
  "신한지주",
  "NH투자증권",
  "미래에셋증권",
  "삼성증권",
  "VIP자산운용",
  "한국금융지주",
  "메리츠금융지주",
  "OK저축은행",
  "JP Morgan",
  "BlackRock",
  "CreditSuiss",
  "MorganStanley",
  "Fidelity",
  "Capital",
];

function Index() {
  const [tree, setTree] = useState<TreeType>();
  const [predict, setPredict] = useState();
  const [market, setMarket] = useState();
  const [major, setMajor] = useState();
  const [count, setCount] = useState();

  async function fetchMajor() {
    const major = {};
    for await (const e of list) {
      const res = await Fetcher("read", { url: `share/${e}.json` });
      major[e] = res.data.slice(0, 10);
    }
    return major;
  }
  useEffect(() => {
    Fetcher("read", { url: "meta/light/tree.json" }).then((res) => {
      setTree(res);
    });
    Fetcher("read", { url: "meta/pred.json" }).then((res) => {
      setPredict(res);
    });
    Fetcher("read", { url: "meta/light/market.json" }).then((res) => {
      res.kospi = res.kospi.slice(0, N);
      res.kosdaq = res.kosdaq.slice(0, N);
      setMarket(res);
    });
    Fetcher("read", { url: "meta/light/updown.json" }).then((res) => {
      setCount(res);
    });
    fetchMajor().then((res) => {
      setMajor(res);
    });
    return () => {
      setTree(undefined);
      setPredict(undefined);
      setMarket(undefined);
      setMajor(undefined);
      setCount(undefined);
    };
  }, []);

  const props = { tree, predict, market, major, count };
  return (
    <section>
      <Market {...props} />
      <GroupInduty {...props} />
      <MajorShare {...props} />
    </section>
  );
}

export default Index;
