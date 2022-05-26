namespace CloudApi.Antiforgery;

[AttributeUsage(AttributeTargets.Class | AttributeTargets.Method, Inherited = true, AllowMultiple = false)]
public class IssuesAntiforgeryTokenAttribute : Attribute { }
