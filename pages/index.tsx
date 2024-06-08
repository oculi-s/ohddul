import GroupInduty from "@/components/subIndex/GroupInduty";
import MajorShare from "@/components/subIndex/MajorShare";
import Market from "@/components/subIndex/MarketInfo";

import "@/module/array";
import { FetcherRead } from "@/module/fetcher";
import { useEffect, useState } from "react";

function Index() {
  const [predict, setPredict] = useState();

  useEffect(() => {
    FetcherRead("meta/pred.json").then((res) => {
      setPredict(res);
    });
    return () => {
      setPredict(undefined);
    };
  }, []);

  return (
    <div>
      <Market />
      <GroupInduty />
      <MajorShare />
    </div>
  );
}

export default Index;
