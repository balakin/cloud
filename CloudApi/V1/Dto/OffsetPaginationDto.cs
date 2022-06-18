using System.ComponentModel.DataAnnotations;

namespace CloudApi.V1.Dto;

public class OffsetPaginationDto
{
    /// <summary>
    /// Number of entries to skip
    /// </summary>
    [Required(ErrorMessage = "Required parameter")]
    [Range(0, int.MaxValue)]
    public int Offset { get; set; }

    /// <summary>
    /// Number of entries returned per query
    /// </summary>
    [Required(ErrorMessage = "Required parameter")]
    [Range(1, int.MaxValue)]
    public int PageSize { get; set; }

    public OffsetPaginationDto Normalize(int maxPageSize)
    {
        int pageSize = PageSize;
        if (pageSize < 0)
        {
            pageSize = 1;
        }
        else if (pageSize > maxPageSize)
        {
            pageSize = maxPageSize;
        }

        return new OffsetPaginationDto()
        {
            Offset = Offset < 0 ? 0 : Offset,
            PageSize = pageSize,
        };
    }
}
