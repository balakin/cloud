using System.Text.RegularExpressions;
using CloudApi.Models;

namespace CloudApi.Auth;

internal sealed class SessionInfoCollector : ISessionInfoCollector
{
    public SessionInfo Collect(HttpContext context)
    {
        return new SessionInfo
        {
            Ip = GetIp(context.Connection),
            OperationSystem = GetOperationSystemName(context.Request.Headers.UserAgent)
        };
    }

    private static string GetIp(ConnectionInfo connectionInfo)
    {
        return connectionInfo.RemoteIpAddress?.ToString() ?? "Not recognized";
    }

    private static string GetOperationSystemName(string userAgent)
    {
        foreach (OperationSystemRule rule in OperationSystemRules)
        {
            if (rule.Regex.IsMatch(userAgent))
            {
                return rule.Name;
            }
        }

        return "Not recognized";
    }

    private static readonly IEnumerable<OperationSystemRule> OperationSystemRules = new[]
    {
        new OperationSystemRule("Windows 10", "Windows 10.0|Windows NT 10.0"),
        new OperationSystemRule("Windows 8.1", "Windows 8.1|Windows NT 6.3"),
        new OperationSystemRule("Windows 8", "Windows 8|Windows NT 6.2"),
        new OperationSystemRule("Windows 7", "Windows 7|Windows NT 6.1"),
        new OperationSystemRule("Windows Vista", "Windows NT 6.0"),
        new OperationSystemRule("Windows Server 2003", "Windows NT 5.2"),
        new OperationSystemRule("Windows XP", "Windows NT 5.1|Windows XP"),
        new OperationSystemRule("Windows 2000", "Windows NT 5.0|Windows 2000"),
        new OperationSystemRule("Windows ME", "Win 9x 4.90|Windows ME"),
        new OperationSystemRule("Windows 98", "Windows 98|Win98"),
        new OperationSystemRule("Windows 95", "Windows 95|Win95|Windows_95"),
        new OperationSystemRule("Windows NT 4.0", "Windows NT 4.0|WinNT4.0|WinNT|Windows NT"),
        new OperationSystemRule("Windows CE", "Windows CE"),
        new OperationSystemRule("Windows 3.11", "Win16"),
        new OperationSystemRule("Android", "Android"),
        new OperationSystemRule("Open BSD", "OpenBSD"),
        new OperationSystemRule("Sun OS", "SunOS"),
        new OperationSystemRule("Chrome OS", "CrOS"),
        new OperationSystemRule("Linux", "Linux|X11(?!.*CrOS)"),
        new OperationSystemRule("iOS", "iPhone|iPad|iPod"),
        new OperationSystemRule("Mac OS X", "Mac OS X"),
        new OperationSystemRule("Mac OS", "Mac OS|MacPPC|MacIntel|Mac_PowerPC|Macintosh"),
        new OperationSystemRule("QNX", "QNX"),
        new OperationSystemRule("UNIX", "UNIX"),
        new OperationSystemRule("BeOS", "BeOS"),
        new OperationSystemRule("OS/2", "OS/2"),
        new OperationSystemRule("Search Bot", "nuhk|Googlebot|Yammybot|Openbot|Slurp|MSNBot|Ask Jeeves/Teoma|ia_archiver"),
    };

    private class OperationSystemRule
    {
        public string Name { get; }

        public Regex Regex { get; }

        public OperationSystemRule(string name, string pattern)
        {
            Name = name;
            Regex = new Regex(pattern);
        }
    }
}
