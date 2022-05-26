namespace CloudApi.Antiforgery;

public interface IAntiforgeryTokenIssuer
{
    public void IssueToken(HttpContext context);
}
