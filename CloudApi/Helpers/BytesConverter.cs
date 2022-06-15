namespace CloudApi.Helpers;

public static class BytesConverter
{
    public static string ConvertToString(long bytes)
    {
        double kb = bytes / 1024d;
        if (kb < 1024)
        {
            return $"{Math.Round(kb, 1)} KB";
        }

        double mb = kb / 1024d;
        if (mb < 1024)
        {
            return $"{Math.Round(mb, 1)} MB";
        }

        double gb = mb / 1024d;
        if (gb < 1024)
        {
            return $"{Math.Round(gb, 1)} GB";
        }

        double tb = gb / 1024d;
        return $"{Math.Round(tb, 1)} TB";
    }
}
