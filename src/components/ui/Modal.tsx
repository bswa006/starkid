import { Fragment, type ReactNode } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { X } from 'lucide-react';
import { Button } from './Button';

interface ModalProps {
  open?: boolean;
  isOpen?: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  fullScreen?: boolean;
}

export function Modal({
  open,
  isOpen,
  onClose,
  title,
  children,
  maxWidth = 'md',
  className,
  fullScreen = true,
}: ModalProps) {
  const isModalOpen = open ?? isOpen ?? false;
  const maxWidthClasses = {
    sm: 'sm:max-w-sm',
    md: 'sm:max-w-2xl',
    lg: 'sm:max-w-4xl',
    xl: 'sm:max-w-7xl',
  };

  return (
    <Transition appear show={isModalOpen} as={Fragment}>
      <Dialog as="div" className="fixed inset-0 z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className={`flex min-h-full ${!fullScreen ? 'items-center justify-center sm:p-4' : ''}`}>
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-full sm:translate-y-4"
              enterTo="opacity-100 translate-y-0"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0"
              leaveTo="opacity-0 translate-y-full sm:translate-y-4"
            >
              <Dialog.Panel
                className={`w-full ${fullScreen ? 'h-screen' : ''} ${maxWidthClasses[maxWidth]} bg-white dark:bg-slate-900 shadow-xl transition-all flex flex-col ${fullScreen ? '' : 'sm:rounded-lg'} ${className || ''}`}
              >
                <div className="sticky top-0 z-50 px-4 sm:px-6 py-4 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
                  <div className="flex items-center justify-between gap-4">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={onClose}
                      className="-ml-2.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800"
                    >
                      <X className="h-5 w-5 text-slate-500" />
                    </Button>
                    <Dialog.Title
                      as="h3"
                      className="flex-1 text-center text-lg font-semibold text-slate-900 dark:text-white truncate"
                    >
                      {title}
                    </Dialog.Title>
                    <div className="w-9" />{/* Spacer for visual balance */}
                  </div>
                </div>
                <div className="flex-1 overflow-y-auto p-4 sm:p-6">
                  {children}
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
