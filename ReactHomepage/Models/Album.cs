﻿using System;
using System.ComponentModel.DataAnnotations;

namespace ReactHomepage.Models
{
    [Serializable]
    public class Album
    {
        [Key]
        public int AlbumID { get; set; }

        public string Caption { get; set; }

        public bool IsPublic { get; set; }
    }
}
