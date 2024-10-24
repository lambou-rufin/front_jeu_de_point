import React from "react";
import RoundComponent from "../round/RoundComponent";

const Home: React.FC = () => {
  return (
    <>
      <div>
      <RoundComponent currentUserId={0} />
      </div>
    </>
  );
};

export default Home;
