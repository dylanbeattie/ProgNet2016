using System;
using KeyQuest.Modules;

namespace KeyQuest.Characters {
    public class Keysmith : NonPlayerCharacter {
        public Keysmith(string name)
            : base(name) {
            IsWorthy = item => {
                try {
                    return (item.Name.ToLowerInvariant().Contains("gold"));
                } catch (Exception) {
                    return (false);
                }
            };
            Success = " happily sells you a {1} in exchange for your {0}.";
            Failure = " is not running a charity here! If you want {0}, you'll need to give him a a bag of gold!";
            Treasure = new TreasureItem() {
                Name = "Key of Shifting",
                Description = "The Key of Shifting is very mysterious."
            };

        }
    }
}