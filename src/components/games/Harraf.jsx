import React from "react";
import { useSelector } from "react-redux";
import Spinner from "../Spinner";

const HarrafBox = ({
  title,
  minAmount,
  maxAmount,
  onPointChanged,
  gameTypeId,
}) => {
  return (
    <div className="flex flex-col text-center border border-primary">
      <div className="text-sm text-white bg-primary">{title}</div>
      <input
        max={maxAmount}
        min={minAmount}
        onChange={(e) => {
          let payload = {
            amount: e.target.value,
            number: title.toString().padStart(3, "0"),
            gameTypeId: gameTypeId,
          };
          onPointChanged(payload);
        }}
        type="number"
        className="w-full text-center outline-none"
      />
    </div>
  );
};

const Harraf = ({ maxAmount, onPointChanged, handleSubmit, isFormLoading }) => {
  let { appData } = useSelector((state) => state.appData.appData);
  return (
    <form onSubmit={handleSubmit} className="p-3 pt-0 pb-8">
      <h4 className="text-sm font-semibold">Andar Harraf</h4>
      <div className="grid grid-cols-5 gap-4 mt-1">
        <HarrafBox
          maxAmount={maxAmount}
          minAmount={appData?.min_bid_amount}
          title="111"
          onPointChanged={onPointChanged}
          gameTypeId={17}
        />
        <HarrafBox
          maxAmount={maxAmount}
          minAmount={appData?.min_bid_amount}
          title="222"
          onPointChanged={onPointChanged}
          gameTypeId={17}
        />
        <HarrafBox
          maxAmount={maxAmount}
          minAmount={appData?.min_bid_amount}
          title="333"
          onPointChanged={onPointChanged}
          gameTypeId={17}
        />
        <HarrafBox
          maxAmount={maxAmount}
          minAmount={appData?.min_bid_amount}
          title="444"
          onPointChanged={onPointChanged}
          gameTypeId={17}
        />
        <HarrafBox
          maxAmount={maxAmount}
          minAmount={appData?.min_bid_amount}
          title="555"
          onPointChanged={onPointChanged}
          gameTypeId={17}
        />
        <HarrafBox
          maxAmount={maxAmount}
          minAmount={appData?.min_bid_amount}
          title="666"
          onPointChanged={onPointChanged}
          gameTypeId={17}
        />
        <HarrafBox
          maxAmount={maxAmount}
          minAmount={appData?.min_bid_amount}
          title="777"
          onPointChanged={onPointChanged}
          gameTypeId={17}
        />
        <HarrafBox
          maxAmount={maxAmount}
          minAmount={appData?.min_bid_amount}
          title="888"
          onPointChanged={onPointChanged}
          gameTypeId={17}
        />
        <HarrafBox
          maxAmount={maxAmount}
          minAmount={appData?.min_bid_amount}
          title="999"
          onPointChanged={onPointChanged}
          gameTypeId={17}
        />
        <HarrafBox
          maxAmount={maxAmount}
          minAmount={appData?.min_bid_amount}
          title="000"
          onPointChanged={onPointChanged}
          gameTypeId={17}
        />
      </div>
      <h4 className="mt-4 text-sm font-semibold">Bahar Harraf</h4>
      <div className="grid grid-cols-5 gap-4 mt-1">
        <HarrafBox
          maxAmount={maxAmount}
          minAmount={appData?.min_bid_amount}
          title="111"
          onPointChanged={onPointChanged}
          gameTypeId={18}
        />
        <HarrafBox
          maxAmount={maxAmount}
          minAmount={appData?.min_bid_amount}
          title="222"
          onPointChanged={onPointChanged}
          gameTypeId={18}
        />
        <HarrafBox
          maxAmount={maxAmount}
          minAmount={appData?.min_bid_amount}
          title="333"
          onPointChanged={onPointChanged}
          gameTypeId={18}
        />
        <HarrafBox
          maxAmount={maxAmount}
          minAmount={appData?.min_bid_amount}
          title="444"
          onPointChanged={onPointChanged}
          gameTypeId={18}
        />
        <HarrafBox
          maxAmount={maxAmount}
          minAmount={appData?.min_bid_amount}
          title="555"
          onPointChanged={onPointChanged}
          gameTypeId={18}
        />
        <HarrafBox
          maxAmount={maxAmount}
          minAmount={appData?.min_bid_amount}
          title="666"
          onPointChanged={onPointChanged}
          gameTypeId={18}
        />
        <HarrafBox
          maxAmount={maxAmount}
          minAmount={appData?.min_bid_amount}
          title="777"
          onPointChanged={onPointChanged}
          gameTypeId={18}
        />
        <HarrafBox
          maxAmount={maxAmount}
          minAmount={appData?.min_bid_amount}
          title="888"
          onPointChanged={onPointChanged}
          gameTypeId={18}
        />
        <HarrafBox
          maxAmount={maxAmount}
          minAmount={appData?.min_bid_amount}
          title="999"
          onPointChanged={onPointChanged}
          gameTypeId={18}
        />
        <HarrafBox
          maxAmount={maxAmount}
          minAmount={appData?.min_bid_amount}
          title="000"
          onPointChanged={onPointChanged}
          gameTypeId={18}
        />
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

export default Harraf;
