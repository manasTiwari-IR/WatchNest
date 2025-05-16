import { useToaster, Message } from "rsuite";

type MessageType = 'info' | 'success' | 'warning' | 'error';

const Toaster: React.FC<{ type: MessageType; message: string }> = ({ type, message }) => {
    const toaster = useToaster();
    return (
        toaster.push(
            <Message type={type} showIcon closable >
                {message}
            </Message>
            ,
            {
                placement: "topEnd",
                duration: 3000,
                mouseReset: true
            }
        )
    )
}

export default Toaster;
