using System.Linq.Expressions;
using CloudApi.Models;

namespace CloudApi.V1.Dto;

public class SessionDto
{
    public string Key { get; set; } = string.Empty;

    public string OperationSystem { get; set; } = string.Empty;

    public string Ip { get; set; } = string.Empty;

    public bool IsCurrent { get; set; }

    public static Expression<Func<Session, SessionDto>> SelectExpression = (session) => new SessionDto()
    {
        Key = session.Key,
    };
}
