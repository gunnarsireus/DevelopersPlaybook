using System.Reflection;
using Microsoft.AspNetCore.Http;
using Newtonsoft.Json;

namespace ReactHomepage.Models
{
	public static class SessionExtensions
	{
		public static void MySet<T>(this ISession session, string key, T value)
		{
			session.SetString(key, JsonConvert.SerializeObject(value));
		}
		public static T MyGet<T>(this ISession session, string key)
		{
			var value = session.GetString(key);
			return value == null ? default(T) : JsonConvert.DeserializeObject<T>(value);
		}
	}
	public static class Extensions
	{
		public static T Clone<T>(this T obj) where T : class, new()
		{
			T returnValue = new T();
			PropertyInfo[] sourceProperties = obj.GetType().GetProperties();

			foreach (PropertyInfo sourceProp in sourceProperties)
			{
				if (sourceProp.CanWrite)
				{
					sourceProp.SetValue(returnValue, sourceProp.GetValue(obj, null), null);
				}
			}
			return returnValue;
		}

		public static bool IsNumeric(this string s)
		{
			return float.TryParse(s, out float output);
		}
	}
}
