namespace ProductFamilyStateMachine
{
    using System;
    using System.Collections.Generic;
    using System.Linq;


    public enum StateTransition
    {
        StartEditProduct1And2NotStarted,
        StartEditProduct2And1NotStarted,
        EditProduct1,
        EditProduct2,
        FinishEditProduct1,
        FinishEditProduct2,
        CompleteProductFamily,
        CancelProductFamily
    }
    public enum ProductFamilyState
    {
        NoEditStarted,
        Product1EditStarted2NotStarted,
        Product2EditStarted1NotStarted,
        Product1And2EditStarted,
        Product1EditFinished2NotFinished,
        Product2EditFinished1NotFinished,
        Product1And2EditFinished,
        Completed,
        Canceled,
    }

    public enum ProductTypes
    {
        FirstProduct,
        SecondProduct,
    }
    public enum ProductEditStatus
    {
        NotStarted,
        Started,
        Finished
    }

    class ProductFamily
    {

        private static Dictionary<ProductFamilyState, Dictionary<StateTransition, ProductFamilyState>> allowedTransitions = new()
        {
            {
                ProductFamilyState.NoEditStarted,
                new Dictionary<StateTransition, ProductFamilyState>
                {
                    {StateTransition.StartEditProduct1And2NotStarted, ProductFamilyState.Product1EditStarted2NotStarted},
                    {StateTransition.StartEditProduct2And1NotStarted, ProductFamilyState.Product2EditStarted1NotStarted},
                }
            },
            {
                ProductFamilyState.Product1EditStarted2NotStarted,
                new Dictionary<StateTransition, ProductFamilyState>
                {
                    {StateTransition.FinishEditProduct1, ProductFamilyState.Product1EditFinished2NotFinished},
                    {StateTransition.StartEditProduct2And1NotStarted, ProductFamilyState.Product2EditStarted1NotStarted},
                }
            },
            {
                ProductFamilyState.Product2EditStarted1NotStarted,
                new Dictionary<StateTransition, ProductFamilyState>
                {
                    {StateTransition.FinishEditProduct2, ProductFamilyState.Product2EditFinished1NotFinished},
                }
            },
            {
                ProductFamilyState.Product1EditFinished2NotFinished,
                new Dictionary<StateTransition, ProductFamilyState>
                {
                    {StateTransition.StartEditProduct2And1NotStarted, ProductFamilyState.Product2EditStarted1NotStarted},
                }
            },
            {
                ProductFamilyState.Product2EditFinished1NotFinished,
                new Dictionary<StateTransition, ProductFamilyState>
                {
                    {StateTransition.StartEditProduct2And1NotStarted, ProductFamilyState.Product2EditStarted1NotStarted},
                }
            },
            {
                ProductFamilyState.Completed,
                new Dictionary<StateTransition, ProductFamilyState>
                {
                    {StateTransition.CancelProductFamily, ProductFamilyState.Canceled},
                }
            },
            {
                ProductFamilyState.Canceled,
                new Dictionary<StateTransition, ProductFamilyState>
                {
                }
            },
        };

        public Dictionary<ProductFamilyState, Action> StateActions = new Dictionary<ProductFamilyState, Action>();
        
        private ProductFamilyState currentState;
        public List<StateTransition> GetAllowedTransitions()
        {
            if (allowedTransitions.ContainsKey(currentState))
            {
                return allowedTransitions[currentState].Keys.ToList();
            }
            return new List<StateTransition>(); // Return an empty list if no transitions are allowed or if the state is not found.
        }

        public ProductFamily()
        {
            currentState = ProductFamilyState.NoEditStarted;
        }

        public void ChangeState(StateTransition transition)
        {
            // Check if the current state has any allowed transitions
            if (allowedTransitions.ContainsKey(currentState))
            {
                var transitions = allowedTransitions[currentState];

                // Check if the specified transition is allowed from the current state
                if (transitions.ContainsKey(transition))
                {
                    // Transition is allowed, so update the state
                    currentState = transitions[transition];
                    Console.WriteLine($"State changed to {currentState}");
                }
                else
                {
                    // Transition is not allowed
                    Console.WriteLine($"Transition {transition} from {currentState} is not allowed.");
                }
            }
            else
            {
                // No transitions are defined for the current state
                Console.WriteLine($"No transitions are defined for the current state: {currentState}");
            }
        }

        public void EditProduct(Product product)
        {
            Console.WriteLine("Edit the product description (type '0' to finish): ");

            while (true)
            {
                Console.WriteLine($"Description: {product.Description}");
                string userInput = Console.ReadLine();
                if (userInput == "0")
                {
                    break;
                }

                product.Description = userInput;
                Console.WriteLine("Description updated. Continue editing or type '0' to finish:");
                if (userInput == "0")
                {
                    break;
                }
            }
        }

        // Assuming ProductFamily has properties for FirstProduct, SecondProduct, ThirdProduct...
        public void SetupStateActions()
        {
            StateActions = new Dictionary<ProductFamilyState, Action>()
            {
                { ProductFamilyState.Product1EditStarted2NotStarted, () => EditProduct(FirstProduct) },
                { ProductFamilyState.Product2EditStarted1NotStarted, () => EditProduct(SecondProduct) },
                // Add more states and corresponding actions as needed
            };
        }

        public Action GetCurrentStateAction()
        {
            // This method returns the action associated with the current state, if any
            if (StateActions.TryGetValue(currentState, out var action))
            {
                return action;
            }
            return null; // or a default action
        }


        public Product FirstProduct { get; set; }  = new(ProductTypes.FirstProduct);
        public Product SecondProduct { get; set; } = new(ProductTypes.SecondProduct);
        public Product[] Products { get; set; } = new Product[] { new(ProductTypes.FirstProduct), new(ProductTypes.SecondProduct) };
    }

    class Product
    {
        public Product(ProductTypes type)
        {
            ProductType = type;
        }
        public ProductTypes ProductType;
        public ProductEditStatus EditStatus;
        public string Description { get; set; } = string.Empty;
    }

    class Program
    {
        static void Main()
        {
            var productFamily = InitProductFamily();

            do
            {
                Console.WriteLine("Select a state transition to execute:");
                var allowedTransitions = productFamily.GetAllowedTransitions();

                if (allowedTransitions.Count == 0)
                {
                    Console.WriteLine("No transitions are available from the current state.");
                    break; // or continue, depending on your desired flow
                }

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
                    productFamily.ChangeState(allowedTransitions[choice - 1]);
                    // Check if the current state has an associated action and invoke it
                    var action = productFamily.GetCurrentStateAction();
                    action?.Invoke();
                }

                else
                {
                    Console.WriteLine("Invalid selection. Please try again.");
                }

            } while (true);
        }

        static ProductFamily InitProductFamily()
        {
            var productFamily = new ProductFamily();
            productFamily.FirstProduct.Description = "Product 1 Description";
            productFamily.SecondProduct.Description = "Product 2 Description";
            productFamily.SetupStateActions();
            return productFamily;
        }
    }
}