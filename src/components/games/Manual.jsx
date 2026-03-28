import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import Spinner from "../Spinner";

const Manual = ({ maxAmount, onPointChanged, handleSubmit, resetGames, isFormLoading, isSuccessfullySubmitted }) => {
  const { appData } = useSelector((state) => state.appData.appData);
  const [games, setGames] = useState(
    new Array(10).fill({
      jodi: new Array(5).fill(""),
      point: "",
      total: "",
    })
  );

  useEffect(() => {
    if (isSuccessfullySubmitted) {
      setGames(new Array(10).fill({
        jodi: new Array(5).fill(""),
        point: "",
        total: "",
      }));
    }
  }, [isSuccessfullySubmitted]);

  const handleJodiChange = (e, gameIdx, jodiIdx) => {
    const value = e.target.value;
    setGames((prevGames) => {
      const newGames = [...prevGames];
      newGames[gameIdx] = {
        ...newGames[gameIdx],
        jodi: newGames[gameIdx].jodi.map((j, idx) =>
          idx === jodiIdx ? value : j
        )
      };
      return newGames;
    });

    if (value.length === 2) {
      if (jodiIdx < 4) {
        const nextInputId = `jodi-${gameIdx}-${jodiIdx + 1}`;
        document.getElementById(nextInputId).focus();
      } else {
        const pointInputId = `point-${gameIdx}`;
        document.getElementById(pointInputId).focus();
      }
    }
  };

  const handlePointChange = (e, gameIdx) => {
    const value = e.target.value;
    setGames((prevGames) => {
      const newGames = [...prevGames];
      newGames[gameIdx] = {
        ...newGames[gameIdx],
        point: value,
      };
      return newGames;
    });
  };

  const calculateTotal = (game) => {
    const jodiFilled = game.jodi.filter(j => j !== "").length;
    const point = parseInt(game.point, 10) || 0;
    return jodiFilled * point;
  };

  useEffect(() => {
    resetGames();
    games.forEach((game, gameIdx) => {
      game.jodi.forEach(number => {
        if (number !== "") {
          onPointChanged({
            amount: Number(game.point) || 0,
            gameTypeId: 16,
            number: number.toString().padStart(2, "0"),
          });
        }
      });
    });
  }, [games]);

  const totalPoints = games.reduce((sum, game) => {
    const jodiFilled = game.jodi.filter(j => j !== "").length;
    const point = parseInt(game.point, 10) || 0;
    return sum + (jodiFilled * point);
  }, 0);

  return (
    <form onSubmit={(e) => {
      e.preventDefault();
      let jodiArr = [];
      let isValidRow = true;
      games.forEach((game, gameIdx) => {
        game.jodi.forEach(jodi => {
          if (jodi !== "") {
            if (games[gameIdx].point === "") {
              isValidRow = false;
              toast.error("Point can't be empty");
              return;
            }
            jodiArr.push(jodi.toString());
          }
        });
      });
      if (isValidRow) {
        let isValid = jodiArr.length === Array.from(new Set(jodiArr)).length;
        let isEveryJodiTwoDigit = jodiArr.every(jodi => jodi.length === 2);
        if (!isValid) {
          toast.error("Jodi values must be unique.");
        } else if (!isEveryJodiTwoDigit) {
          toast.error("Jodi value must be two digits.");
        } else {
          handleSubmit(e);
        }
      }
    }}>
      <div className="mx-2 text-xs bg-white">
        <table className="border border-primary">
          <thead>
            <tr className="w-auto min-w-max">
              <th className="w-auto font-bold min-w-max border border-primary text-[#e90f76]" colSpan="5">
                Jodi
              </th>
              <th className="w-auto font-bold min-w-max border border-primary text-[#008986]">
                Point
              </th>
              <th className="w-auto font-bold min-w-max border border-primary text-[#551a8e]">
                Total
              </th>
            </tr>
          </thead>
          <tbody>
            {games.map((game, gameIdx) => (
              <tr key={gameIdx} className="w-auto mb-2 border min-w-max border-primary">
                {game.jodi.map((jodi, jodiIdx) => (
                  <td key={jodiIdx} className="w-auto border min-w-max border-primary">
                    <input
                      id={`jodi-${gameIdx}-${jodiIdx}`}
                      value={jodi}
                      min={0}
                      max={99}
                      onChange={(e) => handleJodiChange(e, gameIdx, jodiIdx)}
                      className="w-full text-center outline-none"
                    />
                  </td>
                ))}
                <td className="w-auto border min-w-max border-primary">
                  <input
                    id={`point-${gameIdx}`}
                    value={game.point}
                    onChange={(e) => handlePointChange(e, gameIdx)}
                    min={appData?.min_bid_amount}
                    max={maxAmount}
                    type="number"
                    className="w-full text-center outline-none"
                  />
                </td>
                <td className="w-auto border min-w-max border-primary">
                  <input
                    value={calculateTotal(game)}
                    readOnly
                    className="w-full text-center outline-none"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="flex p-2 mt-4 border-t">
          <small className="font-semibold">Total Points</small>
          <small className="ml-auto font-semibold">{totalPoints}</small>
        </div>
      </div>
      <div className="fixed w-full p-2 max-w-[480px] bottom-0 flex items-center justify-center left-1/2 -translate-x-1/2 h-9">
        <button
          type="submit"
          disabled={isFormLoading}
          className="w-full py-1 text-sm font-semibold text-white rounded-3xl bg-orange"
        >
          {isFormLoading ? <Spinner /> : "Place bet"}
        </button>
      </div>
    </form>
  );
};

export default Manual;
