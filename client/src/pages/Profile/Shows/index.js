import React, { useEffect, useState } from "react";
import { Col, Form, Modal, Row, Table, message } from "antd";
import moment from "moment";
import { useDispatch } from "react-redux";
import { GetAllMovies } from "../../../apicalls/movies";
import { HideLoading, ShowLoading } from "../../../redux/loadersSlice";
import {
  AddShow,
  DeleteShow,
  GetAllShowsByTheatre,
} from "../../../apicalls/theatres";
const Shows = ({ openShowsModal, setOpenShowsModal, theatre }) => {
  const [view, setView] = useState("table");
  const [shows, setShows] = useState([]);
  const [movies, setMovies] = useState([]);

  const dispatch = useDispatch();

  const handleAddShow = async (values) => {
    try {
      dispatch(ShowLoading());
      const response = await AddShow({
        ...values,
        theatre: theatre._id,
      });
      if (response.success) {
        message.success(response.message);
        getData();
        setView("table");
      } else {
        message.error(response.message);
      }
      dispatch(HideLoading());
    } catch (error) {
      message.error(error.message);
      dispatch(HideLoading());
    }
  };

  const handleDelete = async (id) => {
    try {
      dispatch(ShowLoading());
      const response = await DeleteShow({ showId: id });

      if (response.success) {
        message.success(response.message);
        getData();
      } else {
        message.error(response.message);
      }
      dispatch(HideLoading());
    } catch (error) {
      message.error(error.message);
      dispatch(HideLoading());
    }
  };

  const getData = async () => {
    try {
      dispatch(ShowLoading());
      const moviesResponse = await GetAllMovies();
      if (moviesResponse.success) {
        setMovies(moviesResponse.data);
      } else {
        message.error(moviesResponse.message);
      }

      const showsResponse = await GetAllShowsByTheatre({
        theatreId: theatre._id,
      });
      if (showsResponse.success) {
        setShows(showsResponse.data);
      } else {
        message.error(showsResponse.message);
      }
      dispatch(HideLoading());
    } catch (error) {
      message.error(error.message);
      dispatch(HideLoading());
    }
  };
  const columns = [
    {
      title: "Show Name",
      dataIndex: "name",
    },
    {
      title: "Date",
      dataIndex: "date",
      render: (text, record) => {
        return moment(text).format("MMM Do YYYY");
      },
    },
    {
      title: "Time",
      dataIndex: "time",
    },
    {
      title: "Movie",
      dataIndex: "movie",
      render: (text, record) => {
        return record.movie.title;
      },
    },
    {
      title: "Ticket Price",
      dataIndex: "ticketPrice",
    },
    {
      title: "Total Seats",
      dataIndex: "totalSeats",
    },
    {
      title: "Available Seats",
      dataIndex: "availableSeats",
      render: (text, record) => {
        return record.totalSeats - record.bookedSeats.length;
      },
    },
    {
      title: "Action",
      dataIndex: "action",
      render: (text, record) => {
        return (
          <div className="flex gap-1 items-center">
            {record.bookedSeats.length === 0 && (
              <i
                className="ri-delete-bin-line text-xl"
                onClick={() => {
                  handleDelete(record._id);
                }}
              ></i>
            )}
          </div>
        );
      },
    },
  ];
  useEffect(() => {
    getData();
  }, []);
  return (
    <Modal
      title=""
      open={openShowsModal}
      onCancel={() => setOpenShowsModal(false)}
      width={1400}
      footer={null}
    >
      <h1 className="font-bold text-2xl mb-1 uppercase">
        Theatre : {theatre.name}
      </h1>
      <hr />
      <div className="flex justify-between my-2 items-center">
        <h1 className="text-lg uppercase">
          {view === "table" ? "Shows" : "Add Show"}
        </h1>
        {view === "table" && (
          <button
            onClick={() => {
              setView("form");
            }}
            className="border-2 border-solid border-red-600 p-2.5 rounded-lg font-bold"
          >
            Add Show
          </button>
        )}
      </div>
      {view === "table" && <Table columns={columns} dataSource={shows} />}
      {view === "form" && (
        <Form layout="vertical" onFinish={handleAddShow}>
          <Row gutter={[16, 16]}>
            <Col span={8}>
              <Form.Item
                className="block mb-2 text-md font-medium text-black"
                label="Show Name"
                name="name"
                rules={[{ required: true, message: "Please input show name!" }]}
              >
                <input className="border rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5  border-gray-600 placeholder-gray-400 text-black focus:ring-blue-500 focus:border-blue-500" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                className="block mb-2 text-md font-medium text-black"
                label="Date"
                name="date"
                rules={[{ required: true, message: "Please input show date!" }]}
              >
                <input
                  className="border rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5  border-gray-600 placeholder-gray-400 text-black focus:ring-blue-500 focus:border-blue-500"
                  type="date"
                  min={new Date().toISOString().split("T")[0]}
                />
              </Form.Item>
            </Col>

            <Col span={8}>
              <Form.Item
                className="block mb-2 text-md font-medium text-black"
                label="Time"
                name="time"
                rules={[{ required: true, message: "Please input show time!" }]}
              >
                <input
                  type="time"
                  className="border rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5  border-gray-600 placeholder-gray-400 text-black focus:ring-blue-500 focus:border-blue-500"
                />
              </Form.Item>
            </Col>

            <Col span={8}>
              <Form.Item
                className="block mb-2 text-md font-medium text-black"
                label="Movie"
                name="movie"
                rules={[{ required: true, message: "Please select movie!" }]}
              >
                <select className="border rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5  border-gray-600 placeholder-gray-400 text-black focus:ring-blue-500 focus:border-blue-500">
                  <option value="">Select Movie</option>
                  {movies.map((movie) => (
                    <option value={movie._id}>{movie.title}</option>
                  ))}
                </select>
              </Form.Item>
            </Col>

            <Col span={8}>
              <Form.Item
                className="block mb-2 text-md font-medium text-black"
                label="Ticket Price"
                name="ticketPrice"
                rules={[
                  { required: true, message: "Please input ticket price!" },
                ]}
              >
                <input
                  type="number"
                  className="border rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5  border-gray-600 placeholder-gray-400 text-black focus:ring-blue-500 focus:border-blue-500"
                />
              </Form.Item>
            </Col>

            <Col span={8}>
              <Form.Item
                className="block mb-2 text-md font-medium text-black"
                label="Total Seats"
                name="totalSeats"
                rules={[
                  { required: true, message: "Please input total seats!" },
                ]}
              >
                <input
                  type="number"
                  className="border rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5  border-gray-600 placeholder-gray-400 text-black focus:ring-blue-500 focus:border-blue-500"
                />
              </Form.Item>
            </Col>
          </Row>

          <div className="flex justify-end my-5 gap-3">
            <button
              className="w-full border-2 border-black border-solid font-medium rounded-lg text-md px-5 py-2.5 text-center"
              onClick={() => {
                setView("table");
              }}
            >
              Cancel
            </button>
            <button
              className="w-full bg-red-700 text-white hover:bg-red-600 font-medium rounded-lg text-md px-5 py-2.5 text-center"
              type="submit"
            >
              Save
            </button>
          </div>
        </Form>
      )}
    </Modal>
  );
};

export default Shows;
