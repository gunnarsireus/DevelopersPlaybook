using System;
using System.Collections.Generic;

namespace MediaPlayerState
{
    public interface IState
    {
        void Enter(MediaPlayer player);
        void Exit(MediaPlayer player);
        void Play(MediaPlayer player);
        void Pause(MediaPlayer player);
        void Stop(MediaPlayer player);
        List<string> GetValidStates();
    }

    public class PlayingState : IState
    {
        public void Enter(MediaPlayer player) => Console.WriteLine("Entering Playing State.");
        public void Exit(MediaPlayer player) => Console.WriteLine("Exiting Playing State.");
        public void Play(MediaPlayer player) => Console.WriteLine("Already playing.");
        public void Pause(MediaPlayer player)
        {
            Console.WriteLine("Pausing playback.");
            player.TransitionToState(nameof(PausedState));
        }
        public void Stop(MediaPlayer player)
        {
            Console.WriteLine("Stopping playback.");
            player.TransitionToState(nameof(StoppedState));
        }
        public List<string> GetValidStates()
        {
            return new List<string> { "pause", "stop", "list", "exit" };
        }
    }

    public class PausedState : IState
    {
        public void Enter(MediaPlayer player) => Console.WriteLine("Entering Paused State.");
        public void Exit(MediaPlayer player) => Console.WriteLine("Exiting Paused State.");
        public void Play(MediaPlayer player)
        {
            Console.WriteLine("Resuming playback.");
            player.TransitionToState(nameof(PlayingState));
        }
        public void Pause(MediaPlayer player) => Console.WriteLine("Already paused.");
        public void Stop(MediaPlayer player)
        {
            Console.WriteLine("Stopping playback from paused state.");
            player.TransitionToState(nameof(StoppedState));
        }
        public List<string> GetValidStates()
        {
            return new List<string> { "play", "stop", "list", "exit" };
        }
    }

    public class StoppedState : IState
    {
        public void Enter(MediaPlayer player) => Console.WriteLine("Entering Stopped State.");
        public void Exit(MediaPlayer player) => Console.WriteLine("Exiting Stopped State.");
        public void Play(MediaPlayer player)
        {
            Console.WriteLine("Starting playback.");
            player.TransitionToState(nameof(PlayingState));
        }
        public void Pause(MediaPlayer player) => Console.WriteLine("Cannot pause. The player is stopped.");
        public void Stop(MediaPlayer player) => Console.WriteLine("Already stopped.");
        public List<string> GetValidStates()
        {
            return new List<string> { "play", "list", "exit" };
        }
    }

    public class MediaPlayer
    {
        private IState _currentState;
        private readonly Dictionary<string, IState> _states;

        public MediaPlayer()
        {
            _states = new Dictionary<string, IState>
            {
                { nameof(PlayingState), new PlayingState() },
                { nameof(PausedState), new PausedState() },
                { nameof(StoppedState), new StoppedState() }
            };
            _currentState = _states[nameof(StoppedState)];
            _currentState.Enter(this);
        }

        public void TransitionToState(string stateName)
        {
            if (_states.ContainsKey(stateName))
            {
                _currentState.Exit(this);
                _currentState = _states[stateName];
                _currentState.Enter(this);
            }
            else
            {
                Console.WriteLine($"State {stateName} does not exist.");
            }
        }

        public void Play() => _currentState.Play(this);
        public void Pause() => _currentState.Pause(this);
        public void Stop() => _currentState.Stop(this);

        public void ListStates()
        {
            Console.WriteLine("Available states:");
            foreach (var state in _states.Keys)
            {
                Console.WriteLine(state);
            }
        }

        public string GetCurrentState()
        {
            return _currentState.GetType().Name;
        }

        public List<string> GetValidCommands()
        {
            return _currentState.GetValidStates();
        }
    }

    class Program
    {
        static void Main()
        {
            MediaPlayer player = new MediaPlayer();
            string userInput = "";

            while (userInput != "exit")
            {
                Console.WriteLine($"\nCurrent state: {player.GetCurrentState()}");
                List<string> validCommands = player.GetValidCommands();
                Console.WriteLine("Available commands: " + string.Join(", ", validCommands));
                Console.WriteLine("Enter a command:");
                userInput = Console.ReadLine().ToLower();

                if (!validCommands.Contains(userInput))
                {
                    Console.WriteLine("Invalid command. Please try again.");
                    continue;
                }

                switch (userInput)
                {
                    case "play":
                        player.Play();
                        break;
                    case "pause":
                        player.Pause();
                        break;
                    case "stop":
                        player.Stop();
                        break;
                    case "list":
                        player.ListStates();
                        break;
                    case "exit":
                        Console.WriteLine("Exiting...");
                        break;
                    default:
                        Console.WriteLine("Invalid command. Please try again.");
                        break;
                }
            }
        }
    }
}
