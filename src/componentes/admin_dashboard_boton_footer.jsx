

function FooterBotton({titulo,icono, onClick})
{
    return(
    <div onClick={onClick} className="footer-item">

        {icono}
       <span>{titulo}</span>

    </div>
    )
}

export default FooterBotton