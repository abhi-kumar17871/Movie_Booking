import { message } from "antd";
import moment from "moment";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { GetShowById } from "../../apicalls/theatres";
import { HideLoading, ShowLoading } from "../../redux/loadersSlice";
import StripeCheckout from "react-stripe-checkout";
import { BookShowTickets, MakePayment } from "../../apicalls/bookings";

function BookShow() {
  const { user } = useSelector((state) => state.users);
  const [show, setShow] = React.useState(null);
  const [selectedSeats, setSelectedSeats] = React.useState([]);
  const params = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const getData = async () => {
    try {
      dispatch(ShowLoading());
      const response = await GetShowById({
        showId: params.id,
      });
      if (response.success) {
        setShow(response.data);
      } else {
        message.error(response.message);
      }
      dispatch(HideLoading());
    } catch (error) {
      dispatch(HideLoading());
      message.error(error.message);
    }
  };

  const getSeats = () => {
    const columns = 12;
    const totalSeats = show.totalSeats;
    const rows = Math.ceil(totalSeats / columns);

    return (
      <div className="flex gap-1 flex-col m-2 p-3 bg-white border-2">
        {Array.from(Array(rows).keys()).map((seat, index) => {
          return (
            <div className="flex gap-1 justify-center">
              {Array.from(Array(columns).keys()).map((column, index) => {
                const seatNumber = seat * columns + column + 1;
                let seatClass =
                  "flex font-semibold justify-center items-center border-2 border-solid border-gray-300 h-[30px] w-[50px] cursor-pointer";

                if (selectedSeats.includes(seat * columns + column + 1)) {
                  seatClass =
                    "flex font-semibold text-bold justify-center items-center border-2 border-solid border-gray-300 h-[30px] w-[50px] bg-red-500 text-white cursor-pointer";
                }

                if (show.bookedSeats.includes(seat * columns + column + 1)) {
                  seatClass =
                    "pointer-events-none cursor-not-allowed flex font-semibold text-bold justify-center items-center border-2 border-solid border-gray-300 h-[30px] w-[50px] bg-gray-400 text-gray-500";
                }

                return (
                  seat * columns + column + 1 <= totalSeats && (
                    <div
                      className={`${seatClass}`}
                      onClick={() => {
                        if (selectedSeats.includes(seatNumber)) {
                          setSelectedSeats(
                            selectedSeats.filter((item) => item !== seatNumber)
                          );
                        } else {
                          setSelectedSeats([...selectedSeats, seatNumber]);
                        }
                      }}
                    >
                      <h1 className="text-sm">{seat * columns + column + 1}</h1>
                    </div>
                  )
                );
              })}
            </div>
          );
        })}
      </div>
    );
  };

  const book = async (transactionId) => {
    try {
      dispatch(ShowLoading());
      const response = await BookShowTickets({
        show: params.id,
        seats: selectedSeats,
        transactionId,
        user: user._id,
      });
      if (response.success) {
        message.success(response.message);
        navigate("/profile");
      } else {
        message.error(response.message);
      }
      dispatch(HideLoading());
    } catch (error) {
      message.error(error.message);
      dispatch(HideLoading());
    }
  };

  const onToken = async (token) => {
    try {
      dispatch(ShowLoading());
      const response = await MakePayment(
        token,
        selectedSeats.length * show.ticketPrice * 100
      );
      if (response.success) {
        message.success(response.message);
        book(response.data);
      } else {
        message.error(response.message);
      }
      dispatch(HideLoading());
    } catch (error) {
      message.error(error.message);
      dispatch(HideLoading());
    }
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    show && (
      <div className="bg-gray-100 h-[95vh]">
        {/* show infomation */}
        <div className="flex justify-between border-2 border-solid border-gray-500 p-2 items-center">
          <div>
            <h1 className="text-xl font-normal">{show.theatre.name}</h1>
            <h1 className="text-sm">{show.theatre.address}</h1>
          </div>

          <div>
            <h1 className="text-2xl uppercase font-medium">
              {show.movie.title} ({show.movie.language})
            </h1>
          </div>

          <div>
            <h1 className="text-sm">
              {moment(show.date).format("MMM Do yyyy")} -{" "}
              {moment(show.time, "HH:mm").format("hh:mm A")}
            </h1>
          </div>
        </div>
        {/* seats */}
        <div className="flex justify-center mt-2 ">{getSeats()}</div>

        {selectedSeats.length > 0 && (
          <div className="mt-2 flex gap-3 items-center flex-col">
            <div className="flex justify-center">
              <div className="mt-2 flex uppercase p-3 gap-2 border-2 border-solid bg-white">
                <h1 className="text-md font-semibold">
                  Selected Seats: {selectedSeats.join(" , ")}
                </h1>
                <h1 className="text-md font-semibold">
                  Total Price: {selectedSeats.length * show.ticketPrice}
                </h1>
              </div>
            </div>
            <StripeCheckout
              token={onToken}
              currency="INR"
              amount={selectedSeats.length * show.ticketPrice * 100}
              billingAddress
              stripeKey="pk_test_51NgBUGSDxjkKwfqfTWFMPNb4sXJgrogjtuuJqUaSjdEIOUSbnyPlRSlpDuryHNQPIa5N5Zotr04N5AenDO3wJlAF00EUnePJKb"
            >
              <button
                type="submit"
                className="bg-red-700 text-white hover:bg-red-600 font-medium rounded-lg text-md px-5 py-2.5 text-center"
              >
                Book Now
              </button>
            </StripeCheckout>
          </div>
        )}
      </div>
    )
  );
}

export default BookShow;
