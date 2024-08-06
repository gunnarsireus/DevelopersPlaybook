using System;
namespace ProductFamily2ProductsStateMachineIfThenElse;

using System;

class Program
{
    enum ProductState
    {
        NotStarted,
        Editing,
        EditingDone
    }

    enum ProductFamilyState
    {
        NN, // Both Not Started
        NE, // Product 1 Not Started, Product 2 Editing
        ND, // Product 1 Not Started, Product 2 EditingDone
        EN, // Product 1 Editing, Product 2 Not Started
        EE, // Both Editing
        ED, // Product 1 Editing, Product 2 EditingDone
        DN, // Product 1 EditingDone, Product 2 Not Started
        DE, // Product 1 EditingDone, Product 2 Editing
        DD  // Both EditingDone
    }

    class Product
    {
        public string Description { get; set; }
        public ProductState State { get; set; } = ProductState.NotStarted;
    }

    class ProductFamily
    {
        public Product[] Products { get; set; }

        public ProductFamily()
        {
            Products = new Product[]
            {
                new Product { Description = "Product 1" },
                new Product { Description = "Product 2" }
            };
        }

        public ProductFamilyState GetFamilyState()
        {
            // Determine the family state based on the states of the products
            var state1 = Products[0].State;
            var state2 = Products[1].State;

            if (state1 == ProductState.NotStarted && state2 == ProductState.NotStarted)
                return ProductFamilyState.NN;
            if (state1 == ProductState.NotStarted && state2 == ProductState.Editing)
                return ProductFamilyState.NE;
            if (state1 == ProductState.NotStarted && state2 == ProductState.EditingDone)
                return ProductFamilyState.ND;
            if (state1 == ProductState.Editing && state2 == ProductState.NotStarted)
                return ProductFamilyState.EN;
            if (state1 == ProductState.Editing && state2 == ProductState.Editing)
                return ProductFamilyState.EE;
            if (state1 == ProductState.Editing && state2 == ProductState.EditingDone)
                return ProductFamilyState.ED;
            if (state1 == ProductState.EditingDone && state2 == ProductState.NotStarted)
                return ProductFamilyState.DN;
            if (state1 == ProductState.EditingDone && state2 == ProductState.Editing)
                return ProductFamilyState.DE;
            if (state1 == ProductState.EditingDone && state2 == ProductState.EditingDone)
                return ProductFamilyState.DD;

            throw new InvalidOperationException("Unknown state");
        }
    }

    static void Main(string[] args)
    {
        ProductFamily productFamily = new ProductFamily();

        bool continueEditing = true;

        while (continueEditing)
        {
            Console.Clear();
            ShowCurrentState(productFamily);
            Console.WriteLine("Select an option:");

            if (productFamily.GetFamilyState() == ProductFamilyState.NN)
            {
                Console.WriteLine("1: Edit Product 1");
                Console.WriteLine("2: Edit Product 2");
                Console.WriteLine("0: Exit");

                char choice = Console.ReadKey().KeyChar;
                Console.WriteLine();
                if (choice == '0')
                {
                    break;
                } else if (choice=='1')
                {
                    EditProduct(productFamily.Products[0]);
                } else if ( choice=='2')
                {
                    EditProduct(productFamily.Products[1]);
                }
            }
            else if (productFamily.GetFamilyState() == ProductFamilyState.NE)
            {
                Console.WriteLine("1: Edit Product 1");
                Console.WriteLine("2: Finish Product 2");
                Console.WriteLine("0: Exit");

                char choice = Console.ReadKey().KeyChar;
                Console.WriteLine();
                if (choice == '0')
                {
                    break;
                }
                else if (choice == '1')
                {
                    EditProduct(productFamily.Products[0]);
                }
                else if (choice == '2')
                {
                    FinishProduct(productFamily.Products[1]);
                }
            }
            else if (productFamily.GetFamilyState() == ProductFamilyState.EN)
            {
                Console.WriteLine("1: Finish Product 1");
                Console.WriteLine("2: Edit Product 2");
                Console.WriteLine("0: Exit");

                char choice = Console.ReadKey().KeyChar;
                Console.WriteLine();
                if (choice == '0')
                {
                    break;
                }
                else if (choice == '1')
                {
                    FinishProduct(productFamily.Products[0]);
                }
                else if (choice == '2')
                {
                    EditProduct(productFamily.Products[1]);
                }
            }
            else if (productFamily.GetFamilyState() == ProductFamilyState.ND)
            {
                Console.WriteLine("1: Edit Product 1");
                Console.WriteLine("0: Exit");

                char choice = Console.ReadKey().KeyChar;
                Console.WriteLine();
                if (choice == '0')
                {
                    break;
                }
                else if (choice == '1')
                {
                    EditProduct(productFamily.Products[0]);
                }
            }
            else if (productFamily.GetFamilyState() == ProductFamilyState.EE)
            {
                Console.WriteLine("1: Finish Product 1");
                Console.WriteLine("2: Finish Product 2");
                Console.WriteLine("0: Exit");

                char choice = Console.ReadKey().KeyChar;
                Console.WriteLine();
                if (choice == '0')
                {
                    break;
                }
                else if (choice == '1')
                {
                    FinishProduct(productFamily.Products[0]);
                }
                else if (choice == '2')
                {
                    FinishProduct(productFamily.Products[1]);
                }
            }
            else if (productFamily.GetFamilyState() == ProductFamilyState.DN)
            {
                Console.WriteLine("1: Edit Product 2");
                Console.WriteLine("0: Exit");

                char choice = Console.ReadKey().KeyChar;
                Console.WriteLine();
                if (choice == '0')
                {
                    break;
                }
                else if (choice == '1')
                {
                    EditProduct(productFamily.Products[1]);
                }
             }
            else if (productFamily.GetFamilyState() == ProductFamilyState.ED)
            {
                Console.WriteLine("1: Finish Product 1");
                Console.WriteLine("0: Exit");

                char choice = Console.ReadKey().KeyChar;
                Console.WriteLine();
                if (choice == '0')
                {
                    break;
                }
                else if (choice == '1')
                {
                    FinishProduct(productFamily.Products[0]);
                }
            }
            else if (productFamily.GetFamilyState() == ProductFamilyState.DE)
            {
                Console.WriteLine("1: Finish Product 2");
                Console.WriteLine("0: Exit");

                char choice = Console.ReadKey().KeyChar;
                Console.WriteLine();
                if (choice == '0')
                {
                    break;
                }
                else if (choice == '1')
                {
                    FinishProduct(productFamily.Products[1]);
                }
             }
            else if (productFamily.GetFamilyState() == ProductFamilyState.DD)
            {
                Console.Write("Product family finished editing");
                continueEditing =false;
            }
        }

        Console.WriteLine("Exiting...");
    }

    private static void EditProduct(Product product)
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
            product.State = ProductState.Editing;
            product.Description = userInput;
            Console.WriteLine("Description updated. Continue editing or type '0' to finish:");
            if (userInput == "0")
            {
                break;
            }
        }
    }
    private static void FinishProduct(Product product)
    {
        Console.WriteLine($" {product.Description} Editing finished: ");
        product.State = ProductState.EditingDone;
    }


    private static void ShowCurrentState(ProductFamily productFamily)
    {
        // Show current state
        Console.Clear();
        Console.WriteLine("Current States:");
        Console.WriteLine($"Product 1: {productFamily.Products[0].Description}, State: {productFamily.Products[0].State}");
        Console.WriteLine($"Product 2: {productFamily.Products[1].Description}, State: {productFamily.Products[1].State}");
        Console.WriteLine($"ProductFamilState : {productFamily.GetFamilyState()}");
    }
}


