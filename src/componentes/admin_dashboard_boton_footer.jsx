

function FooterBotton({titulo,icono, onClick})
{
    return(
    <div onClick={onClick} className="footer-item">

        <h3>{titulo}</h3>
        {icono}
    </div>
    )
}

export default FooterBotton