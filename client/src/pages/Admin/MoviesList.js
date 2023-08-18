import React, { useEffect, useState } from "react";
import MovieForm from "./MovieForm";
import moment from "moment";
import { Table, message } from "antd";
import { useDispatch } from "react-redux";
import { HideLoading, ShowLoading } from "../../redux/loadersSlice";
import { DeleteMovie, GetAllMovies } from "../../apicalls/movies";

const MoviesList = () => {
  const dispatch = useDispatch();
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

  const handleDelete = async (movieId) => {
    try {
      dispatch(ShowLoading());
      const response = await DeleteMovie({
        movieId,
      });
      if (response.success) {
        message.success(response.message);
        getData();
      } else {
        message.error(response.message);
      }
      dispatch(HideLoading());
    } catch (error) {
      dispatch(HideLoading());
      message.error(error.message);
    }
  };
  useEffect(() => {
    getData();
  }, []);

  const [movies, setMovies] = useState([]);
  const [showMovieFormModal, setShowMovieFormModal] = useState(false);
  const [formType, setFormType] = useState("add");
  const [selectedMovie, setSelectedMovie] = useState(null);
  const columns = [
    {
      title: "Poster",
      dataIndex: "poster",
      render: (text, record) => {
        return (
          <img
            src={record.poster}
            alt="poster"
            height="60"
            width="80"
            className="rounded-lg"
          />
        );
      },
    },
    {
      title: "Name",
      dataIndex: "title",
    },

    {
      title: "Description",
      dataIndex: "description",
    },
    {
      title: "Duration",
      dataIndex: "duration",
    },
    {
      title: "Genre",
      dataIndex: "genre",
    },
    {
      title: "Language",
      dataIndex: "language",
    },
    {
      title: "Release Date",
      dataIndex: "releaseDate",
      render: (text, record) => {
        return moment(record.releaseDate).format("DD-MM-YYYY");
      },
    },
    {
      title: "Action",
      dataIndex: "action",
      render: (text, record) => {
        return (
          <div className="flex gap-1">
            <i
              className="ri-delete-bin-line text-xl"
              onClick={() => {
                handleDelete(record._id);
              }}
            ></i>
            <i
              className="ri-pencil-line text-xl "
              onClick={() => {
                setSelectedMovie(record);
                setFormType("edit");
                setShowMovieFormModal(true);
              }}
            ></i>
          </div>
        );
      },
    },
  ];

  return (
    <div>
      <div className="flex justify-end">
        <button
          type="button"
          className="border-2 border-solid border-red-600 p-2.5 rounded-lg font-bold"
          onClick={() => {
            setShowMovieFormModal(true);
            setFormType("add");
          }}
        >
          Add Movie
        </button>
      </div>
      {showMovieFormModal && (
        <MovieForm
          showMovieFormModal={showMovieFormModal}
          setShowMovieFormModal={setShowMovieFormModal}
          selectedMovie={selectedMovie}
          setSelectedMovie={setSelectedMovie}
          formType={formType}
          getData={getData}
        />
      )}
      <Table
        columns={columns}
        dataSource={movies}
        className="my-1 z-{-500} rounded-md"
      />
    </div>
  );
};

export default MoviesList;
