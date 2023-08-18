import React from "react";
import { Col, Form, message, Modal, Row } from "antd";
import { useDispatch } from "react-redux";
import { HideLoading, ShowLoading } from "../../redux/loadersSlice";
import { AddMovie, UpdateMovie } from "../../apicalls/movies";
import moment from "moment";

function MovieForm({
  showMovieFormModal,
  setShowMovieFormModal,
  selectedMovie,
  setSelectedMovie,
  getData,
  formType,
}) {
  if (selectedMovie) {
    selectedMovie.releaseDate = moment(selectedMovie.releaseDate).format(
      "YYYY-MM-DD"
    );
  }

  const dispatch = useDispatch();
  const onFinish = async (values) => {
    try {
      dispatch(ShowLoading());
      let response = null;

      if (formType === "add") {
        response = await AddMovie(values);
      } else {
        response = await UpdateMovie({
          ...values,
          movieId: selectedMovie._id,
        });
      }

      if (response.success) {
        getData();
        message.success(response.message);
        setShowMovieFormModal(false);
      } else {
        message.error(response.message);
      }
      dispatch(HideLoading());
    } catch (error) {
      dispatch(HideLoading());
      message.error(error.message);
    }
  };

  return (
    <Modal
      title={formType === "add" ? "ADD MOVIE" : "EDIT MOVIE"}
      open={showMovieFormModal}
      onCancel={() => {
        setShowMovieFormModal(false);
        setSelectedMovie(null);
      }}
      zIndex={10}
      footer={null}
      width={800}
    >
      <Form
        className="space-y-6"
        layout="vertical"
        onFinish={onFinish}
        initialValues={selectedMovie}
      >
        <Row gutter={16}>
          <Col span={24}>
            <Form.Item
              label="Movie Name"
              name="title"
              className="block mb-2 text-md font-medium text-black"
            >
              <input
                type="text"
                placeholder="Title"
                className="border rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5  border-gray-600 placeholder-gray-400 text-black focus:ring-blue-500 focus:border-blue-500"
              />
            </Form.Item>
          </Col>

          <Col span={24}>
            <Form.Item
              label="Movie Description"
              name="description"
              className="block mb-2 text-md font-medium text-black"
            >
              <textarea
                type="text"
                rows="5"
                placeholder="Description"
                className="border rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5  border-gray-600 placeholder-gray-400 text-black focus:ring-blue-500 focus:border-blue-500"
              />
            </Form.Item>
          </Col>

          <Col span={8}>
            <Form.Item
              label="Movie Duration"
              name="duration"
              className="block mb-2 text-md font-medium text-black"
            >
              <input
                type="number"
                placeholder="Duration (Min)"
                className="border rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5  border-gray-600 placeholder-gray-400 text-black focus:ring-blue-500 focus:border-blue-500"
              />
            </Form.Item>
          </Col>

          <Col span={8}>
            <Form.Item
              label="Language"
              name="language"
              className="block mb-2 text-md font-medium text-black"
            >
              <select
                name=""
                id=""
                className="border rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5  border-gray-600 placeholder-gray-400 text-black focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select Language</option>
                <option value="Telugu">Telugu</option>
                <option value="English">English</option>
                <option value="Hindi">Hindi</option>
                <option value="Tamil">Tamil</option>
              </select>
            </Form.Item>
          </Col>

          <Col span={8}>
            <Form.Item
              label="Movie Release Date"
              name="releaseDate"
              className="block mb-2 text-md font-medium text-black"
            >
              <input
                type="date"
                className="border rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5  border-gray-600 placeholder-gray-400 text-black focus:ring-blue-500 focus:border-blue-500"
              />
            </Form.Item>
          </Col>

          <Col span={8}>
            <Form.Item
              label="Genre"
              name="genre"
              className="block mb-2 text-md font-medium text-black"
            >
              <select
                name=""
                id=""
                className="border rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5  border-gray-600 placeholder-gray-400 text-black focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select Genre</option>
                <option value="Action">Action</option>
                <option value="Comedy">Comedy</option>
                <option value="Drama">Drama</option>
                <option value="Romance">Romance</option>
              </select>
            </Form.Item>
          </Col>
          <Col span={16}>
            <Form.Item
              label="Poster URL"
              name="poster"
              className="block mb-2 text-md font-medium text-black"
            >
              <input
                type="text"
                placeholder="Poster Image URL"
                className="border rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5  border-gray-600 placeholder-gray-400 text-black focus:ring-blue-500 focus:border-blue-500"
              />
            </Form.Item>
          </Col>
        </Row>

        <div className="flex justify-end gap-1">
          <button
            className="w-full border-2 border-black border-solid font-medium rounded-lg text-md px-5 py-2.5 text-center"
            type="button"
            onClick={() => {
              setShowMovieFormModal(false);
              setSelectedMovie(null);
            }}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="w-full bg-red-700 text-white hover:bg-red-600 font-medium rounded-lg text-md px-5 py-2.5 text-center"
          >
            Save
          </button>
        </div>
      </Form>
    </Modal>
  );
}

export default MovieForm;
