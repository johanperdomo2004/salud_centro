import React from 'react'
import { Modal, ModalContent, ModalHeader, ModalBody, useDisclosure } from "@nextui-org/react";

export const ModalGeneral = ({isOpen, onClose, form, title}) => {
    const { onOpenChange } = useDisclosure();

    return (
        <>
            <Modal
                backdrop="opaque"
                isOpen={isOpen}
                onClose={onClose}
                onOpenChange={onOpenChange}
                className='my-auto backdrop: "bg-gradient-to-t from-zinc-900 to-zinc-900/10 backdrop-opacity-20"'
            >
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader>{title}</ModalHeader>
                            <ModalBody>
                                {form}
                            </ModalBody>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </>
    );
}