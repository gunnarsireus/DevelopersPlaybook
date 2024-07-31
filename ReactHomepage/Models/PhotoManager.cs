using Microsoft.Data.Sqlite;
using Microsoft.EntityFrameworkCore;
using ReactHomepage.DAL;
using ReactHomepage.Interfaces;
using ReactHomepage.ViewModels;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;
using System.Drawing;
using System.Drawing.Drawing2D;
using System.Drawing.Imaging;
using System.IO;
using System.Linq;

namespace ReactHomepage.Models
{
    public class PhotoManager : IPhotoManager
    {
        public static int Random100000(int seed = 100000)
        {
            return GlobalRandom.Next(seed);
        }

        private static readonly Random GlobalRandom = new Random();
        private static int RandomAlbumID = 0;
        private readonly PersonalContext _context;

        public PhotoManager(PersonalContext context)
        {
            _context = context;
        }

        public Stream GetPhoto(int photoid, PhotoSize size)
        {
            byte[] result = null;
            switch (size)
            {
                case PhotoSize.Large:
                    result = _context.Photos.Single(o => o.PhotoID == photoid).BytesFull;
                    break;
                case PhotoSize.Medium:
                    result = _context.Photos.Single(o => o.PhotoID == photoid).BytesPoster;
                    break;
                case PhotoSize.Original:
                    result = _context.Photos.Single(o => o.PhotoID == photoid).BytesOriginal;
                    break;
                case PhotoSize.Small:
                    result = _context.Photos.Single(o => o.PhotoID == photoid).BytesThumb;
                    break;
            }
            try
            {
                return new MemoryStream(result);
            }
            catch
            {
                return null;
            }
        }

        public void DeletePhoto(int photoId)
        {
            var db = _context.Database.GetDbConnection().ConnectionString;
            if (db.IndexOf("Personal.db") != -1)
            {
                using (var conn = new SqliteConnection(db))
                {
                    using (var cmd = new SqliteCommand("DELETE FROM Photos WHERE PhotoID=" + photoId, conn))
                    {
                        conn.Open();
                        cmd.ExecuteNonQuery();
                        conn.Close();
                    }
                }
            }
            else
            {
                using (var connection = new SqlConnection(ConfigurationManager.ConnectionStrings["Personal"].ConnectionString))
                {
                    using (var command = new SqlCommand("RemovePhoto", connection))
                    {
                        command.CommandType = CommandType.StoredProcedure;
                        command.Parameters.Add(new SqlParameter("@PhotoID", photoId));
                        connection.Open();
                        command.ExecuteNonQuery();
                    }
                }
            }
        }

        public void UpdatePhoto(string caption, int photoId)
        {
            var db = _context.Database.GetDbConnection().ConnectionString;
            if (db.IndexOf("Personal.db") != -1)
            {
                using (var conn = new SqliteConnection(db))
                {
                    using (var cmd = new SqliteCommand("UPDATE Photos SET Caption='" + caption + "' WHERE PhotoID=" + photoId, conn))
                    {
                        conn.Open();
                        cmd.ExecuteNonQuery();
                        conn.Close();
                    }
                }
            }
            else
            {
                using (var connection = new SqlConnection(ConfigurationManager.ConnectionStrings["Personal"].ConnectionString))
                {
                    using (var command = new SqlCommand("EditPhoto", connection))
                    {
                        command.CommandType = CommandType.StoredProcedure;
                        command.Parameters.Add(new SqlParameter("@Caption", caption));
                        command.Parameters.Add(new SqlParameter("@PhotoID", photoId));
                        connection.Open();
                        command.ExecuteNonQuery();
                    }
                }
            }
        }

        public Stream GetFirstPhoto(int albumId, PhotoSize size)
        {
            byte[] result = null;
            var photos = GetPhotosByAlbumId(albumId);

            // Check if the album has photos
            if (photos == null || photos.Count == 0)
            {
                return GetDefaultPhotoStream(PhotoSize.Small);
            }

            // Get the appropriate photo based on the requested size
            switch (size)
            {
                case PhotoSize.Large:
                    result = photos[0].BytesFull;
                    break;
                case PhotoSize.Medium:
                    result = photos[0].BytesPoster;
                    break;
                case PhotoSize.Original:
                    result = photos[0].BytesOriginal;
                    break;
                case PhotoSize.Small:
                    result = photos[0].BytesThumb;
                    break;
                default:
                    // Handle unexpected size values if necessary
                    return null;
            }

            if (result == null)
            {
                return null;
            }

            return new MemoryStream(result);
        }

        private Stream GetDefaultPhotoStream(PhotoSize size)
        {
            // Path to the default image, adjust this to your actual default image path
            string defaultImagePath = size switch
            {
                PhotoSize.Large => "wwwroot/Content/images/default-image-large.png",
                PhotoSize.Medium => "wwwroot/Content/images/default-image-medium.png",
                PhotoSize.Original => "wwwroot/Content/images/default-image.png",
                PhotoSize.Small => "wwwroot/Content/images/default-image-small.png",
                _ => "wwwroot/Content/images/default-image-small.png" // Fallback to a generic default image
            };

            // Load the default image as a byte array
            byte[] defaultImageBytes = File.ReadAllBytes(defaultImagePath);

            // Return the image as a stream
            return new MemoryStream(defaultImageBytes);
        }


        public Photo GetPhoto(int photoId)
        {
            return _context.Photos.Single(o => o.PhotoID == photoId);
        }

        public void AddPhoto(int albumId, string caption, byte[] bytesOriginal)
        {
            var db = _context.Database.GetDbConnection().ConnectionString;
            if (db.IndexOf("Personal.db") != -1)
            {
                using (var conn = new SqliteConnection(db))
                {
                    using (var cmd = new SqliteCommand("INSERT INTO Photos (AlbumID, BytesOriginal, Caption, BytesFull, BytesPoster, BytesThumb) VALUES (@P1, @P2, @P3, @P4, @P5, @P6)", conn))
                    {
                        var parameter = new SqliteParameter("@P1", DbType.Int32) { Value = albumId };
                        cmd.Parameters.Add(parameter);
                        parameter = new SqliteParameter("@P2", DbType.Binary) { Value = bytesOriginal };
                        cmd.Parameters.Add(parameter);
                        parameter = new SqliteParameter("@P3", DbType.String) { Value = caption };
                        cmd.Parameters.Add(parameter);
                        parameter = new SqliteParameter("@P4", DbType.Binary) { Value = ResizeImageFile(bytesOriginal, 600) };
                        cmd.Parameters.Add(parameter);
                        parameter = new SqliteParameter("@P5", DbType.Binary) { Value = ResizeImageFile(bytesOriginal, 198) };
                        cmd.Parameters.Add(parameter);
                        parameter = new SqliteParameter("@P6", DbType.Binary) { Value = ResizeImageFile(bytesOriginal, 100) };
                        cmd.Parameters.Add(parameter);
                        conn.Open();
                        cmd.ExecuteNonQuery();
                        conn.Close();
                    }
                }
            }
            else
            {
                using (var connection = new SqlConnection(ConfigurationManager.ConnectionStrings["Personal"].ConnectionString))
                {
                    using (var command = new SqlCommand("AddPhoto", connection))
                    {
                        command.CommandType = CommandType.StoredProcedure;
                        command.Parameters.Add(new SqlParameter("@AlbumID", albumId));
                        command.Parameters.Add(new SqlParameter("@Caption", caption));
                        command.Parameters.Add(new SqlParameter("@BytesOriginal", bytesOriginal));
                        command.Parameters.Add(new SqlParameter("@BytesFull", ResizeImageFile(bytesOriginal, 600)));
                        command.Parameters.Add(new SqlParameter("@BytesPoster", ResizeImageFile(bytesOriginal, 198)));
                        command.Parameters.Add(new SqlParameter("@BytesThumb", ResizeImageFile(bytesOriginal, 100)));
                        connection.Open();
                        command.ExecuteNonQuery();
                    }
                }
            }
        }

        public Album GetAlbum(int albumId)
        {
            return _context.Albums.Single(o => o.AlbumID == albumId);
        }

        public int DeleteAlbum(int albumId)
        {
            var album = _context.Albums.Single(o => o.AlbumID == albumId);
            _context.Albums.Remove(album);
            return _context.SaveChanges();
        }

        public AlbumViewModel AddAlbum(string caption)
        {
            var album = new Album()
            {
                Caption = caption,
                IsPublic = true,
            };

            _context.Albums.Add(album);
            _context.SaveChanges();
            return GetAlbumsWithPhotoCount().Single(a => a.AlbumID == album.AlbumID);
        }

        public int UpdateAlbum(string caption, int albumId)
        {
            var album = _context.Albums.Single(o => o.AlbumID == albumId);
            album.Caption = caption;
            _context.Albums.Update(album);
            return _context.SaveChanges();
        }

        public List<Photo> GetPhotosByAlbumId(int albumId)
        {
            return _context.Photos.Where(o => o.AlbumID == albumId).ToList();
        }

        public List<AlbumViewModel> GetAlbumsWithPhotoCount()
        {
            var albums = _context.Albums
                .Select(album => new AlbumViewModel
                {
                    AlbumID = album.AlbumID,
                    Caption = album.Caption,
                    IsPublic = album.IsPublic,
                    PhotoCount = _context.Photos.Where(photo => photo.AlbumID == album.AlbumID).Count(),
                })
                .ToList();

            return albums;
        }

        public string GetAlbumCaptionByPhotoId(int photoId)
        {
            int albumId = GetPhoto(photoId).AlbumID;
            return GetAlbum(albumId).Caption;
        }

        public int GetAlbumIDFromPhotoID(int photoId)
        {
            return GetPhoto(photoId).AlbumID;
        }

        public int GetRandomAlbumId()
        {
            var albumsList = GetAlbumsWithPhotoCount().Where(a => a.PhotoCount > 0).ToList();
            RandomAlbumID = albumsList[Random100000(albumsList.Count)].AlbumID;
            return RandomAlbumID;
        }

        public int GetRandomPhotoId(int albumId)
        {
            var photoList = GetPhotosByAlbumId(albumId);
            return photoList[Random100000(photoList.Count)].PhotoID;
        }

        private static byte[] ResizeImageFile(byte[] imageFile, int targetSize)
        {
            using (Image oldImage = Image.FromStream(new MemoryStream(imageFile)))
            {
                var newSize = CalculateDimensions(oldImage.Size, targetSize);
                using var newImage = new Bitmap(newSize.Width, newSize.Height, PixelFormat.Format24bppRgb);
                using var canvas = Graphics.FromImage(newImage);
                canvas.SmoothingMode = SmoothingMode.AntiAlias;
                canvas.InterpolationMode = InterpolationMode.HighQualityBicubic;
                canvas.PixelOffsetMode = PixelOffsetMode.HighQuality;
                canvas.DrawImage(oldImage, new Rectangle(new Point(0, 0), newSize));
                var m = new MemoryStream();
                newImage.Save(m, ImageFormat.Jpeg);
                return m.GetBuffer();
            }
        }

        private static Size CalculateDimensions(Size oldSize, int targetSize)
        {
            var newSize = default(Size);
            if ((oldSize.Height > oldSize.Width))
            {
                newSize.Width = Convert.ToInt32((oldSize.Width * Convert.ToSingle((targetSize / Convert.ToSingle(oldSize.Height)))));
                newSize.Height = targetSize;
            }
            else
            {
                newSize.Width = targetSize;
                newSize.Height = Convert.ToInt32((oldSize.Height * Convert.ToSingle((targetSize / Convert.ToSingle(oldSize.Width)))));
            }
            return newSize;
        }
    }
}