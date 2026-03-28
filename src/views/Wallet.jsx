import React, { useContext, useEffect, useRef, useState } from "react";
import AmountSelector from "../components/AmountSelector";
import Modal from "../components/Modal";
import Logo from "../assets/imgs/Logo.png";
import { ModalContext } from '../context/ModalContext.js'
import {
  getDepositHistory,
  getWithdrawalHistory,
} from "../repository/HistoryRepository.js";
import moment from "moment";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  depositBalance,
  depositBalancePaymentKaro,
  depositBalanceRunPaisa,
  depositBalancePayFromUpi,
  depositBalanceRudraxPay,
  depositBalanceQRCode,
  getUserBalance,
  transferBalance,
  withdrawBalance,
  depositBalancePayOMatix,
} from "../repository/BalanceRepository.js";
import Spinner from "../components/Spinner.jsx";
import Pagination from "../components/Pagination.jsx";
import { setAppData, setAuthDataUsersSingleValue } from "../store/features/appData/appDataSlice.js";
import QRCode from "react-qr-code";
import { getAppData } from "../repository/DataRepository.js";
import { ibrPayUPIPaymentUrl } from "../repository/PaymentRepository.js";
import { planetCUPIPaymentUrl } from "../repository/PaymentRepository.js";
import { useLocation } from "react-router-dom";

const WalletHistoryTable = ({
  loading,
  data,
  currentPage,
  lastPage,
  setCurrentPage,
  perPageRecords,
}) => {
  return (
    <>
      <div className="overflow-auto">
        <table className="w-full text-xs table-auto">
          <thead className="bg-greenLight">
            <tr>
              <th className="p-0.5">S No</th>
              <th className="p-0.5">Pay Mode</th>
              <th className="p-0.5">Date</th>
              <th className="p-0.5">Points</th>
              <th className="p-0.5">Closing Balance</th>
              <th className="p-0.5">Status</th>
            </tr>
          </thead>
          {!loading && (
            <tbody>
              {data.map((dataItem, dataItemIdx) => (
                <tr className="text-center">
                  <td className="p-1">
                    {dataItemIdx + 1 + (currentPage - 1) * perPageRecords}
                  </td>
                  <td className="p-1">{dataItem.request_type == 'credit' ? dataItem.deposit_mode : dataItem.withdraw_mode }</td>
                  <td className="p-1">
                    {moment(dataItem["created_at"]).format(
                      "DD-MM-YYYY hh:mm:ss A"
                    )}
                  </td>
                  <td className="p-1">{dataItem.amount}</td>
                  <td className="p-1">{dataItem.current_amount}</td>
                  <td>{dataItem.status}</td>
                </tr>
              ))}
            </tbody>
          )}
        </table>
        {loading && (
          <div className="flex justify-center w-full p-4">
            <div className="grid w-full place-items-center overflow-x-scroll rounded-lg lg:overflow-visible">
              <svg
                className="text-gray-300 animate-spin"
                viewBox="0 0 64 64"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
              >
                <path
                  d="M32 3C35.8083 3 39.5794 3.75011 43.0978 5.20749C46.6163 6.66488 49.8132 8.80101 52.5061 11.4939C55.199 14.1868 57.3351 17.3837 58.7925 20.9022C60.2499 24.4206 61 28.1917 61 32C61 35.8083 60.2499 39.5794 58.7925 43.0978C57.3351 46.6163 55.199 49.8132 52.5061 52.5061C49.8132 55.199 46.6163 57.3351 43.0978 58.7925C39.5794 60.2499 35.8083 61 32 61C28.1917 61 24.4206 60.2499 20.9022 58.7925C17.3837 57.3351 14.1868 55.199 11.4939 52.5061C8.801 49.8132 6.66487 46.6163 5.20749 43.0978C3.7501 39.5794 3 35.8083 3 32C3 28.1917 3.75011 24.4206 5.2075 20.9022C6.66489 17.3837 8.80101 14.1868 11.4939 11.4939C14.1868 8.80099 17.3838 6.66487 20.9022 5.20749C24.4206 3.7501 28.1917 3 32 3L32 3Z"
                  stroke="currentColor"
                  stroke-width="5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                ></path>
                <path
                  d="M32 3C36.5778 3 41.0906 4.08374 45.1692 6.16256C49.2477 8.24138 52.7762 11.2562 55.466 14.9605C58.1558 18.6647 59.9304 22.9531 60.6448 27.4748C61.3591 31.9965 60.9928 36.6232 59.5759 40.9762"
                  stroke="currentColor"
                  stroke-width="5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  className="text-gray-600"
                ></path>
              </svg>
            </div>
          </div>
        )}
      </div>
      {!loading && data.length === 0 ? (
        <div className="w-full p-2 font-semibold text-center">
          No Data Found
        </div>
      ) : (
        ""
      )}
      {!loading && data.length > 0 && (
        <Pagination
          currentPage={currentPage}
          lastPage={lastPage}
          onChange={setCurrentPage}
        />
      )}
    </>
  );
};

const Wallet = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const tabParam = searchParams.get('tab');
  let [activeTab, setActiveTab] = useState(tabParam === "withdrawPoints" ? "withdrawPoints" : "addPoints");
  let [isDepositModal, setDepositModal] = useState(false);
  let [bankAccountType, setBankAccountType] = useState("permanent");
  let [method, setMethod] = useState("bank");
  let [withdrawLoading, setWithdrawLoading] = useState(false);
  let [depositLoading, setDepositLoading] = useState(false);
  let { appData, user } = useSelector((state) => state.appData.appData);
  let [qrCodeModalURL, setQRCodeModalURL] = useState(null);

  let [loading, setLoading] = useState(false);
  let [dataLoading, setDataLoading] = useState(true);

  let walletWithdrawForm = useRef(null);

  let [depositHistoryData, setDepositHistoryData] = useState([]);
  let [withdrawHistoryData, setWithdrawHistoryData] = useState([]);
  let [depositLastPage, setDepositLastPage] = useState(0);
  let [withdrawLastPage, setWithdrawLastPage] = useState(0);
  let [currentPage, setCurrentPage] = useState(1);
  const [accountIFSCCode, setAccountIFSCCode] = useState("")

  let [depositAmount, setDepositAmount] = useState();
  let [withdrawAmount, setWithdrawAmount] = useState();

  let [perPageRecords, setPerPageRecords] = useState(10);

  let { toggleSuccessModalOpen, setSuccessMessage } = useContext(ModalContext)

  let dispatch = useDispatch();

  useEffect(() => {
    setMethod(
      appData.bank_withdraw_enable === 1
        ? "bank"
        : appData.upi_withdraw_enable === 1
          ? "upi"
          : ""
    );
  }, [appData]);

  useEffect(() => {
    if (tabParam) {
      setActiveTab(tabParam === "withdrawPoints" ? "withdrawPoints" : "addPoints");
    }
  }, [tabParam]);

  useEffect(() => {
    setAccountIFSCCode(bankAccountType == "permanent" ? (user?.withdraw_details?.account_ifsc_code || "") : "")
  }, [bankAccountType])

  const toggleDepositModal = () => {
    setDepositModal((prevState) => !prevState);
  };


  const _getDepositHistory = async (page) => {
    let { data } = await getDepositHistory({ page });
    if (data.error === false) {
      let {
        depositHistory: { data: depositHistoryData, last_page, per_page },
      } = data.response;
      setDepositHistoryData(depositHistoryData);
      setDepositLastPage(last_page);
      setPerPageRecords(per_page);
    } else {
      toast.error(data.message);
    }
  };

  const _getWithdrawHistory = async (page) => {
    let { data } = await getWithdrawalHistory({ page });
    if (data.error === false) {
      let {
        depositHistory: { data: depositHistoryData, per_page, last_page },
      } = data.response;
      depositHistoryData = depositHistoryData.map((dhd) => ({
        ...dhd,
        type: dhd.withdraw_mode,
      }));
      setWithdrawHistoryData(depositHistoryData);
      setWithdrawLastPage(last_page);
      setPerPageRecords(per_page);
    } else {
      toast.error(data.message);
    }
  };

  useEffect(() => {
    let getData = async () => {
      try {
        setDataLoading(true);
        await _getDepositHistory(currentPage);
        await _getWithdrawHistory(currentPage);

      } catch (err) {
        toast.error(err.message);
      } finally {
        setDataLoading(false);
      }
    };
    getData();
  }, [currentPage]);

  useEffect(() => {
    if (!user?.id) return;

    let isMounted = true;

    const syncUserBalance = async () => {
      try {
        const { data } = await getUserBalance();
        const latestBalance =
          data?.response?.balance_left ??
          data?.response?.balance ??
          data?.balance_left ??
          data?.balance;

        if (!data?.error && latestBalance !== undefined && isMounted) {
          dispatch(
            setAuthDataUsersSingleValue({
              key: "balance",
              value: latestBalance,
            })
          );
        }
      } catch (err) {
        // Ignore polling failures to avoid showing repeated error toasts.
      }
    };

    syncUserBalance();
    const balanceInterval = setInterval(syncUserBalance, 5000);

    return () => {
      isMounted = false;
      clearInterval(balanceInterval);
    };
  }, [dispatch, user?.id]);

  const onHandleTransferSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      let phone = e.target["phone"].value;
      let amount = e.target["amount"].value;
      let { data } = await transferBalance({ phone, amount });
      if (data.error) {
        toast.error(data.message);
      } else {
        toast.success(data.message);
        let { response } = data;
        setDataLoading(true);
        await _getWithdrawHistory(currentPage);
        dispatch(
          setAuthDataUsersSingleValue({
            key: "balance",
            value: response.balance_left,
          })
        );
        toggleDepositModal();
      }
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
      setDataLoading(false);
    }
  };

  const handleDepositSubmit = async (e) => {
    e.preventDefault();
    try {
      setDepositLoading(true);
      let payload = {
        amount: depositAmount,
      };
      let paymentMethod = appData?.payment_method

      // If amount is less than or equal to 300, always use "auto" payment method
      if (depositAmount <= Number(appData.min_upi_gateway)) {
        paymentMethod = "auto";
      }

      if (paymentMethod === "auto") {
        let { data } = await depositBalance(payload);
        if (data.error) {
          toast.error(data.message);
        } else {
          let aHref = document.createElement('a');
          aHref.href = data.response.payment_url;
          // aHref.target = "_blank";
          aHref.click();
        }
      }
      else if (paymentMethod === "pay_from_upi") {
        let { data } = await depositBalancePayFromUpi(payload);
        if (data.error) {
          toast.error(data.message);
        } else {
          let aHref = document.createElement('a');
          aHref.href = data.response.payment_url;
          aHref.click();
        }
      }
      else if (paymentMethod === "pay_o_matix") {
        let { data } = await depositBalancePayOMatix(payload);
        if (data.error) {
          toast.error(data.message);
        } else {
          let aHref = document.createElement('a');
          aHref.href = data.response.payment_url;
          aHref.click();
        }
      }
      else if (paymentMethod === "rudrax_pay") {
        let { data } = await depositBalanceRudraxPay(payload);
        if (data.error) {
          toast.error(data.message);
        } else {
          let aHref = document.createElement('a');
          aHref.href = data.response.payment_url;
          aHref.click();
        }
      }
      else if (paymentMethod === "run_paisa") {
        let { data } = await depositBalanceRunPaisa(payload);
        if (data.error) {
          toast.error(data.message);
        } else {
          let aHref = document.createElement('a');
          aHref.href = data.response.payment_url;
          aHref.click();
        }
      }
      else if (paymentMethod === "payment_karo") {
        let { data } = await depositBalancePaymentKaro(payload);
        if (data.error) {
          toast.error(data.message);
        } else {
          let aHref = document.createElement('a');
          aHref.href = data.response.payment_url;
          aHref.click();
        }
      }
      else if (paymentMethod === "manual") {
        let baseDomain = appData?.base_domain;
        let url = `${baseDomain}/payment/${user?.id}/${payload?.amount}`
        let aHref = document.createElement('a');
        aHref.href = url;
        aHref.target = "_blank";
        aHref.click();
      } else if (paymentMethod === "ibr_pay") {
        let { data } = await ibrPayUPIPaymentUrl(payload);
        if (data.error) {
          toast.error(data.message);
        } else {
          let aHref = document.createElement('a');
          aHref.href = data?.response?.upiIntent;
          aHref.click();
        }
      } else if (paymentMethod === "planet_c") {
        let { data } = await planetCUPIPaymentUrl(payload);
        if (data.error) {
          toast.error(data.message);
        } else {
          let aHref = document.createElement('a');
          aHref.href = data?.response?.qrString;
          aHref.click();
        }
      } else {
        let { data } = await depositBalanceQRCode(payload);
        if (data.error) {
          toast.error(data.message);
        } else {
          setQRCodeModalURL(data?.response?.upiString)
        }
      }
      setDataLoading(true);
      await _getDepositHistory(currentPage);

      e.target.reset();

    } catch (err) {
      toast.error(err.message);
    } finally {
      setDepositLoading(false);
      setDataLoading(false);
    }
  };
  const handleWithdrawSubmit = async (e) => {
    e.preventDefault();
    try {
      setWithdrawLoading(true);
      let payload = {
        mode: method,
        bankAccountType,
        amount: withdrawAmount,
      };
      if (method === "upi") {
        let upiId = e.target["upi_id"].value;
        payload = { ...payload, upiId };
        if (bankAccountType === "permanent") {
          let withdrawDetails = {
            ...user.withdraw_details,
            upi_id: upiId,
          }
          dispatch(setAuthDataUsersSingleValue({ key: "withdraw_details", value: withdrawDetails }))
        }
      } else if (method === "bank") {
        let bankName = e.target["bank_name"].value;
        let accountHolderName = e.target["account_holder_name"].value;
        let accountNumber = e.target["account_number"].value;
        let accountIFSCCode = e.target["account_ifsc_code"].value;
        payload = {
          ...payload,
          bankName,
          accountHolderName,
          accountNumber,
          accountIFSCCode,
        };
        if (bankAccountType === "permanent") {
          let withdrawDetails = {
            ...user.withdraw_details,
            bank_name: bankName,
            account_holder_name: accountHolderName,
            account_number: accountNumber,
            account_ifsc_code: accountIFSCCode,
          }
          dispatch(setAuthDataUsersSingleValue({ key: "withdraw_details", value: withdrawDetails }))
        }
      }
      let { data } = await withdrawBalance(payload);
      if (data.error) {
        toast.error(data.message);
      } else {
        e.target.reset();
        let { response } = data;
        setDataLoading(true);
        toggleSuccessModalOpen();
        setSuccessMessage(data.message)
        await _getWithdrawHistory(currentPage);
        dispatch(
          setAuthDataUsersSingleValue({
            key: "balance",
            value: response.balance_left,
          })
        );
        dispatch(
          setAuthDataUsersSingleValue({
            key: "balance",
            value: response.balance_left,
          })
        );
      }
    } catch (err) {
      toast.error(err.message);
    } finally {
      setWithdrawLoading(false);
      setDataLoading(false)
    }
  };

  const toggleQRCodeModal = () => {
    setQRCodeModalURL(null)
  }

  return (
    <>
      <Modal isOpen={qrCodeModalURL !== null} toggle={toggleQRCodeModal}>
        <div className="flex p-8 items-center flex-col">
          {qrCodeModalURL !== null &&
            <QRCode value={qrCodeModalURL || ""} />
          }
          <button onClick={async () => {
            toggleQRCodeModal();
            // Update with balance api after 5sec
            let { data } = await getAppData();
            console.log(data)
            if (!data.error) {
              dispatch(setAppData(data.response));
            }
          }} className="py-1 px-12 rounded-full bg-green-500 hover:bg-green-600 transition text-white mt-3">I have paid</button>

        </div>
      </Modal>
      <div className="pb-8">
        <div className={`grid ${tabParam ? 'grid-cols-1' : 'grid-cols-2'} text-sm`}>
          {(!tabParam || tabParam === "addPoints") && (
            <button
              className={`w-full p-2 font-semibold text-white ${activeTab === "addPoints"
                ? "bg-greenLight border-4 border-black"
                : "bg-orange"
                }`}
              onClick={async () => {
                setActiveTab("addPoints");
                setCurrentPage(1);
              }}
            >
              Add Points
            </button>
          )}
          {(!tabParam || tabParam === "withdrawPoints") && (
            <button
              className={`w-full p-2 font-semibold text-white ${activeTab === "withdrawPoints"
                ? "bg-greenLight border-4 border-black"
                : "bg-orange"
                }`}
              onClick={() => {
                setActiveTab("withdrawPoints");
                setCurrentPage(1);
              }}
            >
              Withdraw Points
            </button>
          )}
        </div>
        {activeTab === "addPoints" ? (
          <form onSubmit={handleDepositSubmit}>
            <AmountSelector
              value={depositAmount}
              onChange={setDepositAmount}
              minAmount={appData.min_deposit}
              placeholder="Add Amount"
            />
            <div className="flex justify-center mt-3 mb-2">
              <button
                type="button"
                onClick={() => window.open('https://youtube.com/shorts/gM0Jn6z7jNg?si=MAvaRlb8HoeX5buC', '_blank')}
                className="h-10 px-4 text-sm font-semibold text-white rounded-3xl bg-blue-500 hover:bg-blue-600 transition duration-200"
              >
                पेमेंट करने का तरीका विडियो देखो
              </button>
            </div>
            {/* <p className="px-3 mt-1 text-xs text-center text-red-600">
              आपका पैसा 5 से 10 मिनट मैं एड हो जाएगा
            </p> */}
            <div className="grid items-center grid-cols-1 gap-4 px-3 mt-3">
              <button
                type="submit"
                className="h-10 py-2 text-sm font-semibold text-white rounded-3xl bg-orange"
              >
                {depositLoading ? <Spinner /> : "Add Points"}
              </button>
              {/* <button
                type="button"
                onClick={toggleDepositModal}
                className="h-10 py-2 text-sm font-semibold text-white rounded-3xl bg-orange"
              >
                Transfer Points
              </button> */}
            </div>
          </form>


        ) : (
          <form ref={walletWithdrawForm} onSubmit={handleWithdrawSubmit}>
            <AmountSelector
              value={withdrawAmount}
              onChange={setWithdrawAmount}
              minAmount={appData.min_withdraw}
              placeholder="Withdraw Amount"
              tabParam={tabParam}
            />
            {/* <p className="px-3 mt-1 text-xs text-center text-red-600">
              आपका पैसा 5 से 10 मिनट मैं एड हो जाएगा
            </p> */}
            <p className="px-3 mt-2 text-xs text-center text-blue-400">
              Win Amount :- <b>₹{ user?.withdrawal_balance || 0 }</b>
            </p>
            <p className="px-3 mt-2 text-sm font-semibold text-center text-black">
              Bank Account Details
            </p>
            <div className="flex justify-center gap-3 px-2">
              <label className="inline-flex items-center gap-1">
                <input
                  type="radio"
                  name="bankAccountType"
                  checked={bankAccountType === "permanent"}
                  onChange={() => setBankAccountType("permanent")}
                  value={"permanent"}
                />
                <small>Permanent</small>
              </label>
              <label className="inline-flex items-center gap-1">
                <input
                  type="radio"
                  name="bankAccountType"
                  checked={bankAccountType === "temporary"}
                  onChange={() => {
                    walletWithdrawForm.current.reset();
                    setBankAccountType("temporary")
                  }}
                  value={"temporary"}
                />
                <small>Temporary</small>
              </label>
            </div>
            {appData.upi_withdraw_enable === 1 &&
              appData.bank_withdraw_enable === 1 && (
                <div className="flex flex-col px-3">
                  <label className="text-sm font-bold">Payment Method</label>
                  <select
                    className="px-2 py-1 mt-1 text-black border rounded h-9 border-black/30"
                    name="method"
                    id="method"
                    required
                    value={method}
                    onChange={(e) => setMethod(e.target.value)}
                  >
                    {/* {appData.upi_withdraw_enable === 1 && (
                      <option value={"upi"}>UPI</option>
                    )} */}
                    {appData.bank_withdraw_enable === 1 && (
                      <option value={"bank"}>Bank</option>
                    )}
                  </select>
                </div>
              )}
            {method === "upi" ? (
              <div className="px-3 text-sm">
                <div className="flex flex-col">
                  <input
                    className="px-2 py-1 mt-1 text-black border rounded h-9 border-black/30"
                    type="text"
                    placeholder="UPI id"
                    name="upi_id"
                    id="upi_id"
                    key={"upi"}
                    defaultValue={bankAccountType == "permanent" ? user?.withdraw_details?.upi_id : ""}
                    required
                  />
                </div>
              </div>
            ) : (
              <div className="px-3 text-sm">
                <div className="flex flex-col">
                  <input
                    className="px-2 py-1 mt-1 text-black border rounded h-9 border-black/30"
                    type="text"
                    placeholder="Enter Bank Name"
                    name="bank_name"
                    id="bank_name"
                    key="bankName"
                    defaultValue={bankAccountType == "permanent" ? user?.withdraw_details?.bank_name : ""}
                    required
                  />
                </div>
                <div className="flex flex-col">
                  <input
                    className="px-2 py-1 mt-1 text-black border rounded h-9 border-black/30"
                    type="text"
                    placeholder="Enter Account Holder Name"
                    name="account_holder_name"
                    id="account_holder_name"
                    defaultValue={bankAccountType == "permanent" ? user?.withdraw_details?.account_holder_name : ""}
                    required
                  />
                </div>
                <div className="flex flex-col">
                  <input
                    className="px-2 py-1 mt-1 text-black border rounded h-9 border-black/30"
                    type="number"
                    placeholder="Enter Account Number"
                    name="account_number"
                    id="account_number"
                    required
                    defaultValue={bankAccountType == "permanent" ? user?.withdraw_details?.account_number : ""}
                  />
                </div>
                <div className="flex flex-col">
                  <input
                    className="px-2 py-1 mt-1 text-black border rounded h-9 border-black/30"
                    type="text"
                    placeholder="Enter IFSC Code"
                    name="account_ifsc_code"
                    id="account_ifsc_code"
                    required
                    onChange={(e) => {
                      setAccountIFSCCode(e.target.value.toUpperCase().replace(/\s+/g, ''))
                    }}
                    value={accountIFSCCode}
                  />
                </div>
              </div>
            )}
            <div className="p-3">
              <button
                type="submit"
                className="w-full px-4 py-1 mt-2 text-white border-0 rounded-md bg-orange"
              >
                {withdrawLoading ? <Spinner /> : "Withdraw"}
              </button>
            </div>
          </form>
        )}
        <p className="p-3 mt-1 font-semibold text-center text-blue-400 text-md">
          {activeTab === "addPoints" ? "Deposit" : "Withdraw"} History
        </p>

        <WalletHistoryTable
          currentPage={currentPage}
          setCurrentPage={
            setCurrentPage
          }
          loading={dataLoading}
          perPageRecords={perPageRecords}
          lastPage={
            activeTab === "addPoints" ? depositLastPage : withdrawLastPage
          }
          data={
            activeTab === "addPoints" ? depositHistoryData : withdrawHistoryData
          }
        />
        <Modal isOpen={isDepositModal} toggle={toggleDepositModal}>
          <form onSubmit={onHandleTransferSubmit}>
            <div className="grid grid-cols-3 p-2 font-semibold text-white bg-primary">
              <div></div>
              <div className="text-center">Transfer</div>
              <div className="flex justify-end">
                <button type="button" onClick={toggleDepositModal}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="1.5"
                    stroke="currentColor"
                    className="w-6 h-6"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M6 18 18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            </div>
            <div className="px-3 pb-3 text-sm">
              <div className="flex justify-center">
                <img src={Logo} alt="Logo" className="w-24 h-24" />
              </div>
              <p className="p-1 mt-1 font-semibold text-center text-white rounded bg-primary">
                यहां से आप अपने POINT अपने दोस्तो की ID मैं डाल सकते हो
              </p>
              <input
                type="number"
                className="w-full p-1 px-2 mt-3 border rounded border-black/40 outline-0 focus:border-primary"
                placeholder="Enter Mobile Number"
                name="phone"
                required
              ></input>
              <input
                type="number"
                className="w-full p-1 px-2 mt-1 border rounded border-black/40 outline-0 focus:border-primary"
                placeholder="Amount"
                name="amount"
                required
                min={appData?.min_transfer}
              ></input>
              <button
                type="submit"
                className="w-full h-10 p-1 mt-2 font-semibold text-center text-white rounded shadow text-md bg-primary"
              >
                {loading ? <Spinner /> : "Submit"}
              </button>
            </div>
          </form>
        </Modal>
      </div>
    </>
  );
};

export default Wallet;
