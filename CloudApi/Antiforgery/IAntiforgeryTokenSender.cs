namespace CloudApi.Antiforgery;

public interface IAntiforgeryTokenSender
{
    public void SendToken(HttpContext context);

    public void ResetToken(HttpContext context);
}
