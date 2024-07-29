using System.Collections.Generic;
using System.IO;
using ReactHomepage.Models;
using ReactHomepage.ViewModels;

namespace ReactHomepage.Interfaces
{
    public interface IPhotoManager
    {
        void AddPhoto(int albumId, string caption, byte[] bytesOriginal);
        void DeletePhoto(int photoId);
        void EditPhoto(string caption, int photoId);
        Album GetAlbum(int albumId);
        string GetAlbumCaptionByPhotoId(int photoId);
        int GetAlbumIDFromPhotoID(int photoId);
        List<AlbumViewModel> GetAlbumsWithPhotoCount();
        Stream GetFirstPhoto(int albumId, PhotoSize size);
        Photo GetPhoto(int photoId);
        Stream GetPhoto(int photoid, PhotoSize size);
        List<Photo> GetPhotos(int albumId);
        int GetRandomAlbumId();
        int GetRandomPhotoId(int albumId);
    }
}