public enum TrafficLightState
{
    Red,
    Green,
    Yellow,
    Blinking
}

public enum StateTransition
{
    TurnGreen,
    TurnYellow,
    TurnRed,
    TurnBlinking
}

public class TrafficLightStateMachine
{
    private static readonly Dictionary<TrafficLightState, Dictionary<StateTransition, TrafficLightState>> allowedTransitions = new()
    {
        {
            TrafficLightState.Red,
            new Dictionary<StateTransition, TrafficLightState>
            {
                { StateTransition.TurnYellow, TrafficLightState.Yellow },
                { StateTransition.TurnGreen, TrafficLightState.Green },
            }
        },
        {
            TrafficLightState.Green,
            new Dictionary<StateTransition, TrafficLightState>
            {
                { StateTransition.TurnYellow, TrafficLightState.Yellow },
                { StateTransition.TurnRed, TrafficLightState.Red }
            }
        },
        {
            TrafficLightState.Yellow,
            new Dictionary<StateTransition, TrafficLightState>
            {
                { StateTransition.TurnRed, TrafficLightState.Red },
                { StateTransition.TurnGreen, TrafficLightState.Green },
                { StateTransition.TurnBlinking, TrafficLightState.Blinking }
            }
        },
        {
            TrafficLightState.Blinking,
            new Dictionary<StateTransition, TrafficLightState>
            {
                { StateTransition.TurnRed, TrafficLightState.Red }
            }
        }
    };

    private TrafficLightState currentState;

    public TrafficLightStateMachine()
    {
        currentState = TrafficLightState.Red; // Initial state
    }

    public void ChangeState(StateTransition transition)
    {
        if (allowedTransitions[currentState].TryGetValue(transition, out var newState))
        {
            currentState = newState;
            Console.WriteLine($"State changed to {currentState}");
        }
        else
        {
            Console.WriteLine($"Transition {transition} from {currentState} is not allowed.");
        }
    }

    public void WriteCurrentState()
    {
        Console.WriteLine($"Current state: {currentState}");
    }

    public List<StateTransition> GetAllowedTransitionsByCurrentState()
    {
        return allowedTransitions[currentState].Keys.ToList();
    }

    public class Program
    {
        public static void Main()
        {
            var trafficLight = new TrafficLightStateMachine();

            while (true)
            {
                trafficLight.WriteCurrentState();
                var allowedTransitions = trafficLight.GetAllowedTransitionsByCurrentState();

                if (allowedTransitions.Count == 0)
                {
                    Console.WriteLine("No transitions are available from the current state.");
                    break;
                }

                Console.WriteLine("Select a state transition to execute:");
                for (int i = 0; i < allowedTransitions.Count; i++)
                {
                    Console.WriteLine($"{i + 1}. {allowedTransitions[i]}");
                }

                Console.Write("Enter your choice (or '0' to exit): ");
                if (!int.TryParse(Console.ReadLine(), out int choice) || choice == 0)
                {
                    break; // Exit the loop if the user enters '0' or an invalid number
                }

                if (choice > 0 && choice <= allowedTransitions.Count)
                {
                    trafficLight.ChangeState(allowedTransitions[choice - 1]);
                }
                else
                {
                    Console.WriteLine("Invalid selection. Please try again.");
                }
            }
        }
    }
}
