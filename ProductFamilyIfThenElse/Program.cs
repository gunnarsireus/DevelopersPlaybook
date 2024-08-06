using System;
namespace ProductFamilyIfThenElse;

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
            var state1 = Products[0].State;
            var state2 = Products[1].State;

            return (state1, state2) switch
            {
                (ProductState.NotStarted, ProductState.NotStarted) => ProductFamilyState.NN,
                (ProductState.NotStarted, ProductState.Editing) => ProductFamilyState.NE,
                (ProductState.NotStarted, ProductState.EditingDone) => ProductFamilyState.ND,
                (ProductState.Editing, ProductState.NotStarted) => ProductFamilyState.EN,
                (ProductState.Editing, ProductState.Editing) => ProductFamilyState.EE,
                (ProductState.Editing, ProductState.EditingDone) => ProductFamilyState.ED,
                (ProductState.EditingDone, ProductState.NotStarted) => ProductFamilyState.DN,
                (ProductState.EditingDone, ProductState.Editing) => ProductFamilyState.DE,
                (ProductState.EditingDone, ProductState.EditingDone) => ProductFamilyState.DD,
                _ => throw new InvalidOperationException("Unknown state")
            };
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

            ProductFamilyState familyState = productFamily.GetFamilyState();
            DisplayOptions(familyState);

            char choice = Console.ReadKey().KeyChar;
            Console.WriteLine();

            if (choice == '0')
            {
                break;
            }

            HandleChoice(choice, familyState, productFamily, ref continueEditing);
        }

        Console.WriteLine("Exiting...");
    }

    private static void DisplayOptions(ProductFamilyState state)
    {
        switch (state)
        {
            case ProductFamilyState.NN:
                Console.WriteLine("1: Edit Product 1");
                Console.WriteLine("2: Edit Product 2");
                break;
            case ProductFamilyState.NE:
                Console.WriteLine("1: Edit Product 1");
                Console.WriteLine("2: Finish Product 2");
                break;
            case ProductFamilyState.EN:
                Console.WriteLine("1: Finish Product 1");
                Console.WriteLine("2: Edit Product 2");
                break;
            case ProductFamilyState.ND:
                Console.WriteLine("1: Edit Product 1");
                break;
            case ProductFamilyState.EE:
                Console.WriteLine("1: Finish Product 1");
                Console.WriteLine("2: Finish Product 2");
                break;
            case ProductFamilyState.ED:
                Console.WriteLine("1: Finish Product 1");
                break;
            case ProductFamilyState.DN:
                Console.WriteLine("2: Edit Product 2");
                break;
            case ProductFamilyState.DE:
                Console.WriteLine("2: Finish Product 2");
                break;
            case ProductFamilyState.DD:
                Console.WriteLine("Product family finished editing");
                break;
        }
        Console.WriteLine("0: Exit");
    }

    private static void HandleChoice(char choice, ProductFamilyState state, ProductFamily productFamily, ref bool continueEditing)
    {
        switch (state)
        {
            case ProductFamilyState.NN:
                if (choice == '1')
                {
                    EditProduct(productFamily.Products[0]);
                }
                else if (choice == '2')
                {
                    EditProduct(productFamily.Products[1]);
                }
                break;
            case ProductFamilyState.NE:
                if (choice == '1')
                {
                    EditProduct(productFamily.Products[0]);
                } else if (choice == '2')
                {
                    FinishProduct(productFamily.Products[1]);
                }
                break;
            case ProductFamilyState.EN:
                if (choice == '1')
                {
                    FinishProduct(productFamily.Products[0]);
                }
                else if (choice == '2')
                {
                    EditProduct(productFamily.Products[1]);
                }
                break;
            case ProductFamilyState.ND:
                if (choice == '1')
                {
                    EditProduct(productFamily.Products[0]);
                }
                break;
            case ProductFamilyState.EE:
                if (choice == '1')
                {
                    FinishProduct(productFamily.Products[0]);
                }
                else if (choice == '2')
                {
                    FinishProduct(productFamily.Products[1]);
                }
                break;
            case ProductFamilyState.ED:
                if (choice == '1')
                {
                    FinishProduct(productFamily.Products[0]);
                }
                break;
            case ProductFamilyState.DN:
                if (choice == '2')
                {
                    EditProduct(productFamily.Products[1]);
                }
                break;
            case ProductFamilyState.DE:
                if (choice == '2')
                {
                    FinishProduct(productFamily.Products[1]);
                }
                break;
            case ProductFamilyState.DD:
                continueEditing = false;
                break;
        }
    }

    private static void EditProduct(Product product)
    {
        Console.WriteLine("Edit the product description (type '0' to finish): ");
        product.State = ProductState.Editing;

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
        }
    }

    private static void FinishProduct(Product product)
    {
        Console.WriteLine($"Finishing editing for {product.Description}");
        product.State = ProductState.EditingDone;
    }

    private static void ShowCurrentState(ProductFamily productFamily)
    {
        Console.WriteLine("Current States:");
        for (int i = 0; i < productFamily.Products.Length; i++)
        {
            Console.WriteLine($"Product {i + 1}: {productFamily.Products[i].Description}, State: {productFamily.Products[i].State}");
        }
        Console.WriteLine($"ProductFamily State: {productFamily.GetFamilyState()}");
        Console.WriteLine();
    }
}



