import { Form, message } from "antd";
import Modal from "antd/es/modal/Modal";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { HideLoading, ShowLoading } from "../../redux/loadersSlice";
import { AddTheatre, UpdateTheatre } from "../../apicalls/theatres";

const TheatreForm = ({
  showTheatreFormModal,
  setShowTheatreFormModal,
  formType,
  setFormType,
  selectedTheatre,
  setSelectedTheatre,
  getData,
}) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.users);
  const onFinish = async (values) => {
    values.owner = user._id;
    try {
      dispatch(ShowLoading());
      let response = null;
      if (formType === "add") {
        response = await AddTheatre(values);
      } else {
        values.theatreId = selectedTheatre._id;
        response = await UpdateTheatre(values);
      }

      if (response.success) {
        message.success(response.message);
        setShowTheatreFormModal(false);
        setSelectedTheatre(null);
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

  return (
    <Modal
      title={formType === "add" ? "Add Theatre" : "Edit Theatre"}
      open={showTheatreFormModal}
      onCancel={() => {
        setShowTheatreFormModal(false);
        setSelectedTheatre(null);
      }}
      zIndex={10}
      footer={null}
    >
      <Form
        layout="vertical"
        onFinish={onFinish}
        className="space-y-6"
        initialValues={selectedTheatre}
      >
        <Form.Item
          label="Name"
          name="name"
          className="block mb-2 text-md font-medium text-black"
          rules={[{ required: true, message: "Please input theatre name!" }]}
        >
          <input
            type="text"
            placeholder="Theatre Name"
            className="border rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5  border-gray-600 placeholder-gray-400 text-black focus:ring-blue-500 focus:border-blue-500"
          />
        </Form.Item>

        <Form.Item
          label="Address"
          name="address"
          className="block mb-2 text-md font-medium text-black"
          rules={[{ required: true, message: "Please input theatre address!" }]}
        >
          <textarea
            type="text"
            rows="5"
            placeholder="Address"
            className="border rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5  border-gray-600 placeholder-gray-400 text-black focus:ring-blue-500 focus:border-blue-500"
          />
        </Form.Item>
        <div className="grid grid-cols-2 gap-5">
          <Form.Item
            label="Phone Number"
            name="phone"
            className="block mb-2 text-md font-medium text-black"
            rules={[
              { required: true, message: "Please input theatre phone number!" },
            ]}
          >
            <input
              type="text"
              placeholder="Contact"
              className="border rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5  border-gray-600 placeholder-gray-400 text-black focus:ring-blue-500 focus:border-blue-500"
            />
          </Form.Item>

          <Form.Item
            label="Email"
            name="email"
            className="block mb-2 text-md font-medium text-black"
            rules={[{ required: true, message: "Please input theatre email!" }]}
          >
            <input
              type="text"
              placeholder="Email"
              className="border rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5  border-gray-600 placeholder-gray-400 text-black focus:ring-blue-500 focus:border-blue-500"
            />
          </Form.Item>
        </div>
        <div className="flex justify-end gap-1">
          <button
            className="w-full border-2 border-black border-solid font-medium rounded-lg text-md px-5 py-2.5 text-center"
            type="button"
            onClick={() => {
              setShowTheatreFormModal(false);
              setSelectedTheatre(null);
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
};

export default TheatreForm;
