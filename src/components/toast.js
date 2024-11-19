


const ToastGeneral = ({status, messg}) => {
    return ( 
        <div className={status === false ? "toast-box error" : status === true ? "toast-box sus" : "toast-box"}>
            <p>{messg}</p>
        </div>
    );
}
 
export default ToastGeneral;