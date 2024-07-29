namespace PoissonDistribution
{
    public class Program
    {
        const int MaximumX = 60;
        const int NumberOfSteps = 40; // Number of steps on the y-axis
        static void Main()
        {
            while (true)
            {
                Console.Write("Please choose Lambda value greater or equal 1:");
                double lambda;
                while (!double.TryParse(Console.ReadLine(), out lambda) || lambda < 1)
                {
                    Console.WriteLine("Invalid input. Please choose Lambda value greater or equal 1:");
                }

                Console.WriteLine("Lambda is " + lambda + ", and the area under the curve is 1.");
                var poisson = new PoissonDistribution(lambda);
                int maxK = (int)(3 * lambda);

                int step = 1;
                if (maxK > MaximumX)
                {
                    step = (int)Math.Ceiling((double)maxK / MaximumX);
                }

                // Calculate the maximum y value (probability)
                double maxY = 0;
                for (int k = 0; k <= maxK; k++)
                {
                    double probability = poisson.ProbabilityMassFunction(k);
                    if (probability > maxY)
                    {
                        maxY = probability;
                    }
                }

                // Calculate the y-axis step size
                double yStep = maxY / NumberOfSteps;

                for (double y = maxY; y >= 0; y -= yStep)
                {
                    Console.Write($"{y:F4} |");
                    for (int k = 0; k <= maxK; k += step)
                    {
                        double probability = poisson.ProbabilityMassFunction(k);
                        if (Math.Abs(probability - y) < yStep / 2)
                        {
                            Console.Write("  x ");
                        }
                        else
                        {
                            Console.Write("    ");
                        }
                    }
                    Console.WriteLine();
                }

                // Print footer
                Console.Write("     ");
                for (int k = 0; k <= maxK; k += step)
                {
                    Console.Write($"{k,4}");
                }
                Console.WriteLine();
            }
        }
    }
}
