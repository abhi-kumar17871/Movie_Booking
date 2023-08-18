import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { HideLoading, ShowLoading } from "../../redux/loadersSlice";
import { GetAllMovies } from "../../apicalls/movies";
import { Col, message, Row } from "antd";
import moment from "moment";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const [searchText = "", setSearchText] = React.useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [movies, setMovies] = useState([]);
  const getData = async () => {
    try {
      dispatch(ShowLoading);
      const response = await GetAllMovies();
      if (response.success) {
        setMovies(response.data);
      } else {
        message.error(response.message);
      }
      dispatch(HideLoading);
    } catch (error) {
      message.error(error.message);
      dispatch(HideLoading);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <div className="m-2">
      <div className="mb-4">
        <input
          className="border rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5  border-gray-600 placeholder-gray-400 text-black focus:ring-blue-500 focus:border-blue-500"
          type="text"
          placeholder="Search for movies"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
      </div>
      <div className="pl-">
        <Row gutter={[20]}>
          {movies
            .filter((movie) =>
              movie.title.toLowerCase().includes(searchText.toLowerCase())
            )
            .map((movie) => (
              <Col span={6}>
                <div
                  className="flex bg-white border-2 border-solid border-gray-400 flex-col gap-1 cursor-pointer"
                  onClick={() =>
                    navigate(
                      `/movie/${movie._id}?date=${moment().format(
                        "YYYY-MM-DD"
                      )}`
                    )
                  }
                >
                  <img src={movie.poster} alt="" className="h-[200px]" />
                  <div className="flex justify-center p-1">
                    <h1 className="text-md font-bold uppercase">
                      {movie.title}
                    </h1>
                  </div>
                </div>
              </Col>
            ))}
        </Row>
      </div>
    </div>
  );
};

export default Home;
