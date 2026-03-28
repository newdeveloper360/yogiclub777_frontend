import React, { useEffect, useState } from "react";
import { getBonusReport } from "../repository/BonusRepository";
import { toast } from "react-toastify";
import Spinner from "../components/Spinner";
import { useSelector } from "react-redux";

const BonusReport = () => {
  let [totalPages, setTotalPages] = useState(10);
  let [currentPage, setCurrentPage] = useState(1);
  let [referralUsers, setReferralUsers] = useState([]);
  let [loading, setLoading] = useState(false);

  let [totalEarned, setTotalEarned] = useState(0);
  let [totalInvited, setTotalInvited] = useState(0);

  let { appData } = useSelector(state => state.appData.appData);

  useEffect(() => {
    document.title = "Bonus Report | Yogi Club777"
  }, [])


  const fetchBonusReport = async () => {
    try {
      setLoading(true);
      let { data } = await getBonusReport({
        page: currentPage,
      });
      if (data.error == false) {
        setReferralUsers(data.response.referralUsers);
        setTotalEarned(data.response.total_earned);
        setTotalInvited(data.response.total_invited);
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      toast.error(err.message)
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchBonusReport();
  }, [currentPage]);
  return (
    <div className="pb-8">
      <div className="flex p-3 text-white bg-primary">
        <div className="flex flex-col text-sm">
          <h4 className="font-semibold text-white bg-orange py-2 px-3 rounded-md">
            You will get bonus of their bids every time they lose
          </h4>
          <div className="mt-2">Total Earned: {totalEarned}</div>
          <div>Total Referred: {totalInvited}</div>
          <label className="mt-3 font-semibold">Earn Upto : <span className="bg-orange py-1 px-2 rounded-md">{appData.invite_bonus} %</span> of Referral Amount</label>
        </div>
      </div>
      {/* <div className="flex p-3 text-sm">
        <div className="flex items-center gap-1">
          <small>Show</small>
          <select className="p-1 text-sm border rounded-sm border-black/80">
            <option>10</option>
            <option>25</option>
            <option>50</option>
            <option>100</option>
          </select>
          <small>entries</small>
        </div>
        <div className="flex items-center gap-1 ml-auto">
          <small>Search</small>
          <input
            type="text"
            className="p-1 w-[150px] text-sm border rounded-sm border-black/80"
          />
        </div>
      </div> */}
      <div className="w-full overflow-auto">
        <table className="w-full text-xs table-auto">
          <thead className="bg-greenLight">
            <tr>
              <th className="p-0.5">Name</th>
              <th className="p-0.5">Id</th>
              <th className="p-0.5">Phone</th>
              <th className="p-0.5">Date</th>
            </tr>
          </thead>
          <tbody>
            {referralUsers.map(referralUser => (
              <tr className="text-center">
                <td className="p-1">{referralUser.name}</td>
                <td className="p-1">{referralUser.id}</td>
                <td className="p-1">{referralUser.phone}</td>
                <td className="p-1">{referralUser.created_at}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {loading && referralUsers.length === 0 && <div className="pt-3"><Spinner /></div>}
      {!loading && referralUsers.length === 0 &&
        <div className="w-full p-2 font-semibold text-center">No Data Found</div>
      }
    </div>
  );
};

export default BonusReport;
