import React, { useContext, useEffect, useState } from "react";
import Logo from "../assets/imgs/Logo.png";
import { useDispatch, useSelector } from "react-redux";
import { updateProfile } from "../repository/AuthRepository";
import { toast } from "react-toastify";
import Spinner from "../components/Spinner";
import { getAppData } from "../repository/DataRepository";
import { setAppData } from "../store/features/appData/appDataSlice";
import { ModalContext } from "../context/ModalContext";

const EditProfile = () => {
  let dispatch = useDispatch();

  let { user } = useSelector((state) => state.appData.appData);

  let { toggleSuccessModalOpen, setSuccessMessage } = useContext(ModalContext)

  let [email, setEmail] = useState("");
  let [dob, setDob] = useState("");
  let [name, setName] = useState("");

  let [loading, setLoading] = useState(false);

  const fetchAppData = async () => {
    let {data} = await getAppData();
    if(!data.error){
      dispatch(setAppData(data.response));
    }
  }

  useEffect(() => {
    setEmail(user?.email);
    setDob(user?.dob);
    setName(user?.name);
  }, [user]);

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      let payload = {
        name,
        dob,
        email,
      };
      let { data } = await updateProfile(payload);
      if (data.error === false) {
        toggleSuccessModalOpen();
        setSuccessMessage(data.message)
        fetchAppData();
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="flex flex-col items-center p-3 pb-12 bg-primary">
        <div className="w-32 h-32 overflow-hidden rounded-full">
          <img src={Logo} alt="Logo" className="w-full h-full" />
        </div>
      </div>
      <div className="p-8 pt-10 -mt-5 bg-white rounded-3xl">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="p-2 px-3 font-bold text-center text-white rounded-md bg-greenLight">
            Balance: {user?.balance}
          </div>
          <div className="p-2 px-3 font-bold text-center text-white rounded-md bg-greenLight hidden">
            Bonus: {user?.bonus}
          </div>
        </div>
        <form onSubmit={handleProfileSubmit} className="text-xs">
          <div className="flex flex-col mt-4">
            <label className="text-sm font-semibold">Name</label>
            <input
              type="text"
              className="py-2 mt-1 border-b outline-0 focus:border-primary"
              placeholder="Your Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            ></input>
          </div>
          <div className="flex flex-col mt-3">
            <label className="text-sm font-semibold">Date Of Birth</label>
            <input
              type="date"
              className="py-2 mt-1 border-b outline-0 focus:border-primary"
              placeholder="Your DOB"
              value={dob}
              onChange={(e) => setDob(e.target.value)}
            ></input>
          </div>
          <div className="flex flex-col mt-3">
            <label className="text-sm font-semibold">Email</label>
            <input
              type="email"
              className="py-2 mt-1 border-b outline-0 focus:border-primary"
              placeholder="Your Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            ></input>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="block w-full px-3 py-2 mt-3 h-10 text-sm font-semibold text-white rounded-lg bg-primary"
          >
            {loading ? <Spinner /> : "Save"}
          </button>
        </form>
      </div>
    </>
  );
};

export default EditProfile;
