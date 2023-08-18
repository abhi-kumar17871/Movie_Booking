import { Fragment, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import logo from "../pages/assets/logo.png";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const { user } = useSelector((state) => state.users);
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  return (
    <div className="bg-white">
      {/* Mobile menu */}
      <Transition.Root show={open} as={Fragment}>
        <Dialog as="div" className="relative z-40 lg:hidden" onClose={setOpen}>
          <div className="fixed inset-0 z-40 flex">
            <Transition.Child
              as={Fragment}
              enter="transition ease-in-out duration-300 transform"
              enterFrom="-translate-x-full"
              enterTo="translate-x-0"
              leave="transition ease-in-out duration-300 transform"
              leaveFrom="translate-x-0"
              leaveTo="-translate-x-full"
            >
              <Dialog.Panel className="relative flex w-full max-w-xs flex-col overflow-y-auto bg-white pb-12 shadow-xl">
                <div className="flex px-4 pb-2 pt-5">
                  <button
                    type="button"
                    className="relative -m-2 inline-flex items-center justify-center rounded-md p-2 text-gray-400"
                    onClick={() => setOpen(false)}
                  >
                    <span className="absolute -inset-0.5" />
                    <span className="sr-only">Close menu</span>
                    <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                  </button>
                  <div className="bg-white text-xl font-bold p-2 flex gap-1">
                    MENU
                  </div>
                </div>

                {/* Links */}
                <div className="space-y-6 border-t border-gray-200 px-4 py-6">
                  <div className="flow-root">
                    <a
                      className="-m-2 py-1 cursor-pointer block p-2 uppercase font-medium text-gray-900"
                      onClick={() => {
                        if (user.isAdmin) {
                          navigate("/admin");
                        } else {
                          navigate("/profile");
                        }
                      }}
                    >
                      {user.name}
                    </a>
                  </div>
                  <div className="flow-root">
                    <a
                      onClick={() => {
                        localStorage.removeItem("token");
                        navigate("/login");
                      }}
                      className="-m-2 block p-2 font-medium text-gray-900"
                    >
                      LOGOUT
                    </a>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>

      <header className="relative bg-white">
        <nav
          aria-label="Top"
          className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8"
        >
          <div className="border-b py-2 border-gray-200">
            <div className="flex h-16 items-center">
              <button
                type="button"
                className="relative rounded-md bg-white p-2 text-gray-400 lg:hidden"
                onClick={() => setOpen(true)}
              >
                <span className="absolute -inset-0.5" />
                <span className="sr-only">Open menu</span>
                <Bars3Icon className="h-6 w-6" aria-hidden="true" />
              </button>

              {/* Logo */}
              <div className="ml-4 flex lg:ml-0">
                <a href="/">
                  <span className="sr-only">Your Company</span>
                  <img className="h-32 w-full" src={logo} alt="" />
                </a>
              </div>

              <div className="ml-auto flex items-center">
                <div className="hidden lg:flex lg:flex-1 lg:items-center lg:justify-end lg:space-x-6">
                  <a
                    className="-m-2 py-1 cursor-pointer block p-2 uppercase font-medium text-gray-900"
                    onClick={() => {
                      if (user.isAdmin) {
                        navigate("/admin");
                      } else {
                        navigate("/profile");
                      }
                    }}
                  >
                    {user.name}
                  </a>
                  <span className="h-6 w-px bg-gray-200" aria-hidden="true" />
                  <a
                    onClick={() => {
                      localStorage.removeItem("token");
                      navigate("/login");
                    }}
                    className="-m-2 block p-2 cursor-pointer font-medium text-gray-900"
                  >
                    LOGOUT
                  </a>
                </div>
              </div>
            </div>
          </div>
        </nav>
      </header>
    </div>
  );
}
